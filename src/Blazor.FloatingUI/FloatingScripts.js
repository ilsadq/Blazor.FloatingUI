import * as FloatingCore from "@floating-ui/dom";

class FloatingWrapper extends HTMLElement {
    _listener = null;
    
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
    }
}

window.customElements.define("floating-wrapper", FloatingWrapper);
