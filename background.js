// Runs inside the page (all frames) when the extension icon is clicked.
function clearAllFields() {
  const skipTypes = new Set(["hidden", "submit", "button", "reset", "image"]);

  // Use the native setter so frameworks like React/Vue notice the change.
  const setNative = (el, prop, value) => {
    const proto = Object.getPrototypeOf(el);
    const desc = Object.getOwnPropertyDescriptor(proto, prop);
    if (desc && desc.set) desc.set.call(el, value);
    else el[prop] = value;
  };

  const fire = (el) => {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  };

  // Inputs
  document.querySelectorAll("input").forEach((el) => {
    const type = (el.type || "text").toLowerCase();
    if (skipTypes.has(type) || el.disabled || el.readOnly) return;

    if (type === "checkbox" || type === "radio") {
      if (el.checked) {
        setNative(el, "checked", false);
        fire(el);
      }
    } else if (type === "file") {
      el.value = "";
      fire(el);
    } else {
      setNative(el, "value", "");
      fire(el);
    }
  });

  // Textareas
  document.querySelectorAll("textarea").forEach((el) => {
    if (el.disabled || el.readOnly) return;
    setNative(el, "value", "");
    fire(el);
  });

  // Dropdowns -> reset to no selection / first option
  document.querySelectorAll("select").forEach((el) => {
    if (el.disabled) return;
    el.selectedIndex = el.multiple ? -1 : 0;
    fire(el);
  });

  // Rich-text / contenteditable areas
  document.querySelectorAll('[contenteditable=""], [contenteditable="true"]').forEach((el) => {
    el.textContent = "";
    fire(el);
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: clearAllFields
    });
  } catch (err) {
    // Happens on restricted pages like chrome://, the Web Store, etc.
    console.warn("Could not clear fields on this page:", err);
  }
});
