namespace Blazor.FloatingUI;

public interface IFloatingJsProvider : IAsyncDisposable
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
    ///
    /// </param>
    public Task ComputePosition(string contentId, string triggerId, FloatingSettingsModel settings);

    /// <summary>
    /// Remove floating tracking event
    /// </summary>
    public Task Remove();
}