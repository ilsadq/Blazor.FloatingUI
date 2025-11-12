# Floating UI

All documentation on this site and parameters were taken from this documentation.

[Visit FloatingUI website](https://floating-ui.com/)

---

### Installation

```shell
dotnet add package Blazor.FloatingUI
```

---

#### App.razor

```htmlinblazor
<SectionOutlet SectionId="FloatingConstants.FloatingSection"/>
<script src="@Assets["_content/Blazor.FloatingUI/FloatingScripts.iife.js"]"></script>
```

#### app.css

```css
floating-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(var(--floating-left), var(--floating-top));
}
```

---

### Description

This is a barebones library that provides access to the `FloatingUI` library and facilitates the transfer of float elements to the end of the document.

You can use this library to create dropdowns, combo boxes, hints, etc.

This library is more intended for use with other libraries or custom components.

---

### Basic Principles

To bind a floating window to your trigger, you must pass `@context` in the id field; otherwise, nothing will work.

---

### Examples

Basic `FloatingWrapper` example where there are no enhancements such as focus checking, etc.

```razor
<FloatingWrapper IsOpen="_isOpen">
    <TriggerTemplate>
        <button @onclick="() => _isOpen = true"
                id="@context">
            CLICK ME
        </button>
    </TriggerTemplate>
    <ContentTemplate>
        <div class="floating__content__wrapper"
             tabindex="0"
             @onblur="() => _isOpen = false">
            <ul>
                @foreach (var item in Enumerable.Range(0, 10))
                {
                    <li @onclick="ClickHandler">
                        Item @item
                    </li>
                }
            </ul>
        </div>
    </ContentTemplate>
</FloatingWrapper>

@code {

    private bool _isOpen;

    private void ClickHandler()
    {
        _isOpen = false;
    }

}
```

---

If you need additional information, feel free to ask.

