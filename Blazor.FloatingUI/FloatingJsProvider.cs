using Microsoft.JSInterop;

namespace Blazor.FloatingUI;

public class FloatingJsProvider(IJSRuntime js) : IFloatingJsProvider
{
    private readonly Task<IJSObjectReference> _module = js.InvokeAsync<IJSObjectReference>("import", "./_content/Blazor.FloatingUI/floating.module.js").AsTask();

    public async Task ComputePosition(string contentId, string triggerId, FloatingSettingsModel settings)
    {
        var js = await _module;
        await js.InvokeVoidAsync("computePosition", contentId, triggerId, settings);
    }

    public async Task Remove()
    {
        var js = await _module;
        await js.InvokeVoidAsync("clean");
    }

    public ValueTask DisposeAsync()
    {
        _module.Dispose();
        return ValueTask.CompletedTask;
    }
}