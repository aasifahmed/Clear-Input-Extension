Click the icon on any page and every field on that page is emptied.

What it clears:

Text-like inputs (text, email, password, search, number and so on) and textareas
Checkboxes and radio buttons are unchecked, and file inputs are reset
Dropdowns go back to their first option, or to no selection for multi-selects
Rich-text boxes (contenteditable)

Behaviour to know about:

It also clears fields inside iframes.
It skips hidden, disabled and read-only fields, plus submit and button inputs, so forms keep working.
It triggers input and change events, so React, Vue and similar sites register the cleared values instead of restoring them.
It only works on the tab you click it on, and only at that moment, through the activeTab permission.
Chrome blocks extensions on pages like chrome:// and the Web Store, so it does nothing there.
