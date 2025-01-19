using Microsoft.JSInterop;

namespace Blazor.FloatingUI;

public class FloatingJsProvider(IJSRuntime js) : IFloatingJsProvider
{
    /// <summary>
    /// Computes coordinates to position a floating element next to another element.
    /// </summary>
    /// <param name="contentId">
    ///     This is the element that floats next to the reference element,
    ///     remaining anchored to it. This is the popover or tooltip itself.
    /// </param>
    /// <param name="triggerId">
    ///     Also known as the anchor element, this is the element that is being referred to for positioning.
    ///     Often this is a button that triggers a floating popover like a tooltip or menu.
    /// </param>
    /// <param name="settings">
    ///     Floating UI settings <see href="https://floating-ui.com/docs/middleware"/>
    /// </param>
    public ValueTask ComputePosition(string contentId, string triggerId, FloatingSettingsModel settings)
    {
        return js.InvokeVoidAsync("blazorFloatingUi.computePosition", contentId, triggerId, settings);
    }

    /// <summary>
    ///     Remove floating tracking event
    /// </summary>
    /// <param name="id">Target element ID</param>
    public ValueTask Remove(string id)
    {
        return js.InvokeVoidAsync("blazorFloatingUi.removeListener", id);
    }
}