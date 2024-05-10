using Microsoft.JSInterop;

namespace Blazor.FloatingUI
{
    public class FloatingJsProvider : IFloatingJsProvider
    {
        private readonly Lazy<Task<IJSObjectReference>> _module;

        public FloatingJsProvider(IJSRuntime js)
        {
            _module = new(
                js.InvokeAsync<IJSObjectReference>("import", "./_content/Blazor.FloatingUI/floating.module.js").AsTask()
            );
        }

        public async Task ComputePosition(string contentId, string triggerId, FloatingSettingsModel settings)
        {
            var js = await _module.Value;
            await js.InvokeVoidAsync("computePosition", contentId, triggerId, settings);
        }

        public async Task Remove()
        {
            var js = await _module.Value;
            await js.InvokeVoidAsync("clean");
        }

        public async ValueTask DisposeAsync()
        {
            if (!_module.IsValueCreated) return;

            await Remove();
            _module.Value.Dispose();
        }
    }
}
