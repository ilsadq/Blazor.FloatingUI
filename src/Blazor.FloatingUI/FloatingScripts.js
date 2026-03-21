import * as FloatingCore from "@floating-ui/dom";

class FloatingWrapper extends HTMLElement {
    _listener = null;
    _dismissCleanup = null;

    connectedCallback() {
        const settings = JSON.parse(this.getAttribute("settings"));
        const target = document.getElementById(this.getAttribute("target-id"));
        const middleware = [];

        if (!settings.flip && settings.autoPlacement) {
            middleware.push(FloatingCore.autoPlacement());
        }

        if (settings.offset || settings.offsetModel) {
            middleware.push(FloatingCore.offset(settings.offsetModel ?? settings.offset));
        }

        if (settings.shift) {
            middleware.push(FloatingCore.shift());
        }

        if (!settings.autoPlacement && settings.flip) {
            middleware.push(FloatingCore.flip());
        }

        if (settings.arrowId) {
            middleware.push(FloatingCore.arrow(
                {element: document.getElementById(settings.arrowId)}
            ));
        }

        if (settings.size) {
            middleware.push(FloatingCore.size({
                apply({availableWidth, availableHeight, elements}) {
                    Object.assign(elements.floating.style, {
                        maxWidth: `${availableWidth}px`,
                        maxHeight: `${availableHeight}px`,
                    })
                }
            }))
        }

        this._listener = FloatingCore.autoUpdate(target, this, () => {
                FloatingCore.computePosition(target, this, {
                    ...settings,
                    middleware,
                    platform: {
                        ...FloatingCore.platform,
                    }
                }).then(({x, y, middlewareData}) => {
                    this.style.setProperty("--floating-left", `${x}px`);
                    this.style.setProperty("--floating-top", `${y}px`);

                    if (middlewareData.hide) {
                        Object.assign(this.style, {
                            visibility: middlewareData.hide.referenceHidden ? "hidden" : "visible"
                        })
                    }

                    if (middlewareData.arrow) {
                        const {x, y} = middlewareData.arrow;
                        const arrowEl = document.getElementById(settings.arrowId);

                        if (x) arrowEl.style.setProperty("--floating-arrow-left", `${x}px`);
                        if (y) arrowEl.style.setProperty("--floating-arrow-top", `${y}px`);
                    }

                    this.style.setProperty("--min-width", settings.width ?? `${target.clientWidth}px`);
                });
            },
            {
                animationFrame: settings.animationFrame,
                layoutShift: settings.layoutShift,
                elementResize: settings.elementResize,
                ancestorResize: settings.ancestorResize
            }
        );
    }

    disconnectedCallback() {
        this._listener?.();
        this._dismissCleanup?.();
    }
}

window.customElements.define("floating-wrapper", FloatingWrapper);

window.FloatingUI = window.FloatingUI || {};

window.FloatingUI.setupDismiss = function(element, targetId, settingsJson, dotNetRef) {
    const settings = JSON.parse(settingsJson);
    const target = document.getElementById(targetId);
    const listeners = [];

    if (settings.dismissOnOutsideClick) {
        const onPointerDown = (e) => {
            if (!element.contains(e.target) && (!target || !target.contains(e.target))) {
                // Stop the event from reaching the underlying element.
                // The outside click should only close the floating content, not trigger
                // actions on elements behind it (e.g. opening another dropdown, navigating).
                e.stopPropagation();
                e.preventDefault();

                // Swallow subsequent events in the pointer → click chain.
                // Browser fires: pointerdown → pointerup → click (desktop)
                // or: pointerdown → touchend → pointerup → click (mobile)
                // Without this, the underlying element would process the interaction.
                const swallow = (evt) => { evt.stopPropagation(); evt.preventDefault(); };
                document.addEventListener('pointerup', swallow, { capture: true, once: true });
                document.addEventListener('click', swallow, { capture: true, once: true });

                dotNetRef.invokeMethodAsync('OnDismissed');
            }
        };

        // Delay listener attachment to avoid catching the click that opened the dropdown
        requestAnimationFrame(() => {
            document.addEventListener('pointerdown', onPointerDown, true);
        });

        listeners.push(() => document.removeEventListener('pointerdown', onPointerDown, true));
    }

    if (settings.dismissOnEscape) {
        const onKeyDown = (e) => {
            if (e.key === 'Escape') {
                dotNetRef.invokeMethodAsync('OnDismissed');
            }
        };

        document.addEventListener('keydown', onKeyDown);
        listeners.push(() => document.removeEventListener('keydown', onKeyDown));
    }

    element._dismissCleanup = () => {
        listeners.forEach(fn => fn());
    };
};

window.FloatingUI.cleanupDismiss = function(element) {
    element?._dismissCleanup?.();
};
