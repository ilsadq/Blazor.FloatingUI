# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

A Blazor wrapper for the [Floating UI](https://floating-ui.com/) JavaScript positioning library. Enables dropdowns, tooltips, combo boxes with automatic positioning (flip, shift, auto-placement). Targets `net8.0` and `net9.0`.

## Build

The build has two stages - JS (Vite) then .NET:

```bash
# Full build (JS + .NET) - runs automatically via .csproj MSBuild targets
cd src/Blazor.FloatingUI
dotnet build

# JS only (when editing FloatingScripts.js)
cd src/Blazor.FloatingUI
npm install    # first time
npm run build  # compiles FloatingScripts.js → wwwroot/FloatingScripts.iife.js via Vite
```

The .csproj has `PrePack` target that runs `npm install` + `npm run build` before `BeforeBuild`, so `dotnet build` handles everything. But when iterating on JS changes, running `npm run build` directly is faster.

## Architecture

### Data flow (one-directional by default)

```
C# FloatingWrapper → FloatingContentWrapper → JSON attribute → <floating-wrapper> custom element → JS positioning
```

1. `FloatingWrapper.razor` - Main consumer-facing component. Controls visibility via `IsOpen`. Renders content into a `SectionOutlet` at document end (avoids z-index stacking issues).
2. `FloatingContentWrapper.razor` - Serializes `FloatingSettingsModel` to JSON (camelCase) and passes as HTML attribute to the `<floating-wrapper>` custom element.
3. `FloatingScripts.js` - Defines the `<floating-wrapper>` web component. Reads settings from attribute, sets up `@floating-ui/dom` positioning with middleware, writes CSS custom properties (`--floating-left`, `--floating-top`).

### Dismiss feature (bidirectional via DotNetObjectReference)

The dismiss functionality adds JS→C# communication:
- `FloatingContentWrapper` passes a `DotNetObjectReference` to JS via `IJSRuntime.InvokeVoidAsync("FloatingUI.setupDismiss", ...)`
- JS sets up `pointerdown` (not `mousedown` - mobile compatible) and `keydown` listeners
- Outside click/Escape calls `dotNetRef.invokeMethodAsync('OnDismissed')` back to C#
- Outside clicks are fully swallowed (`pointerdown` + `pointerup` + `click` stopped) so underlying elements don't receive the event

### Key files

- `FloatingScripts.js` - JS source (compiled by Vite to `wwwroot/FloatingScripts.iife.js`)
- `FloatingWrapper.razor` - Public component with all parameters
- `FloatingContentWrapper.razor` - Internal bridge between C# and the custom element
- `FloatingSettingsModel.cs` - Settings object serialized to JSON for JS
- `FloatingConstants.cs` - Contains `FloatingSection` for the Sections API

### Consumer setup requirements

Consumers must add three things:
1. `<SectionOutlet SectionId="FloatingConstants.FloatingSection"/>` in their layout
2. `<script src="_content/Blazor.FloatingUI/FloatingScripts.iife.js">` in their HTML
3. CSS for `floating-wrapper` element (position, transform with CSS custom properties)

### Critical: the `@context` ID binding

`TargetTemplate` is a `RenderFragment<string>` - the `@context` is the auto-generated element ID. The trigger element **must** set `id="@context"` or positioning won't work.

## No Tests

There are no test projects in this repo currently.
