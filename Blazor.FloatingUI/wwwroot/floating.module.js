let _cleanup;

export function roundByDPR(value) {
    const dpr = window.devicePixelRatio || 1;
    return Math.round(value * dpr) / dpr;
}

/**
 * @param {HTMLDivElement} contentId
 * @param {HTMLDivElement} triggerId
 */
export function computePosition(contentId, triggerId, settings) {
    const content = document.getElementById(contentId);
    const trigger = document.getElementById(triggerId);
    const middleware = [];

    if (!settings.flip && settings.autoPlacement) {
        middleware.push(window.FloatingUIDOM.autoPlacement());
    }

    if (settings.offset || settings.offsetModel) {
        middleware.push(window.FloatingUIDOM.offset(settings.offsetModel ?? settings.offset));
    }

    if (settings.shift) {
        middleware.push(window.FloatingUIDOM.shift());
    }

    if (!settings.autoPlacement && settings.flip) {
        middleware.push(window.FloatingUIDOM.flip());
    }

    if (settings.arrowId) {
        middleware.push(window.FloatingUIDOM.arrow(
            { element: document.getElementById(settings.arrowId) }
        ));
    }

    if (settings.size) {
        middleware.push(window.FloatingUIDOM.size({
            apply({ availableWidth, availableHeight, elements }) {
                Object.assign(elements.floating.style, {
                    maxWidth: `${availableWidth}px`,
                    maxHeight: `${availableHeight}px`,
                })
            }
        }))
    }

    _cleanup = window.FloatingUIDOM.autoUpdate(trigger, content, () => {
        window.FloatingUIDOM
            .computePosition(trigger, content, {
                ...settings,
                middleware,
                platform: {
                    ...window.FloatingUIDOM.platform,
                }
            })
            .then(({ x, y, middlewareData }) => {
                Object.assign(content.style, {
                    top: `${y}px`,
                    left: `${x}px`
                });

                if (middlewareData.hide) {
                    Object.assign(content.style, {
                        visibility: middlewareData.hide.referenceHidden ? "hidden" : "visible"
                    })
                }

                if (middlewareData.arrow) {
                    const { x, y } = middlewareData.arrow;
                    const arrowEl = document.getElementById(settings.arrowId);

                    Object.assign(arrowEl.style, {
                        left: x != null ? `${x}px` : '',
                        top: y != null ? `${y}px` : '',
                    });
                }

                content.style.setProperty("--min-width", settings.width ?? `${trigger.clientWidth}px`);
            });
    }, {
        animationFrame: settings.animationFrame,
        layoutShift: settings.layoutShift,
        elementResize: settings.elementResize,
        ancestorResize: settings.ancestorResize
    });

    if (settings.focus) content.focus();
}

export function clean() {
    if (_cleanup) _cleanup();
}
