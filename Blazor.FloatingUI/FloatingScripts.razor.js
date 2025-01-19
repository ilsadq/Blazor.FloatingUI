import * as FloatingCore from "@floating-ui/dom";

window.blazorFloatingUi = {};
window.blazorFloatingUi.listeners ??= new WeakMap();

/**
 * @param {string} contentId
 * @param {string} triggerId
 * @param {FloatingSettingsModel} settings
 */
window.blazorFloatingUi.computePosition = (contentId, triggerId, settings) => {
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

    const content = document.getElementById(contentId);
    const trigger = document.getElementById(triggerId);

    const _listener = FloatingCore.autoUpdate(trigger, content, () => {
            FloatingCore.computePosition(trigger, content, {
                ...settings,
                middleware,
                platform: {
                    ...FloatingCore.platform,
                }
            }).then(({x, y, middlewareData}) => {
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
                    const {x, y} = middlewareData.arrow;
                    const arrowEl = document.getElementById(settings.arrowId);

                    Object.assign(arrowEl.style, {
                        left: x != null ? `${x}px` : '',
                        top: y != null ? `${y}px` : '',
                    });
                }

                content.style.setProperty("--min-width", settings.width ?? `${trigger.clientWidth}px`);
            });
        },
        {
            animationFrame: settings.animationFrame,
            layoutShift: settings.layoutShift,
            elementResize: settings.elementResize,
            ancestorResize: settings.ancestorResize
        }
    );

    window.blazorFloatingUi.listeners.set(trigger, _listener);
}

/**
 * Remove floating autoUpdate listener
 * @param {string} id
 */
window.blazorFloatingUi.removeListener = (id) => {
    const element = document.getElementById(id);
    window.blazorFloatingUi.listeners.delete(element);
}

/**
 * Configuration model for floating UI behavior.
 *
 * @typedef {Object} FloatingSettingsModel
 * @property {string|null} [strategy] - The strategy to be used for floating positioning.
 * @property {string|null} [placement] - The placement of the floating element.
 * @property {boolean} autoPlacement - If true, automatically adjusts placement based on available space.
 * @property {number|null} [offset] - The offset value for floating placement.
 * @property {OffsetModel|null} [offsetModel] - Model describing the offset behavior, null if no model is applied.
 * @property {boolean} shift - If true, the floating element will be shifted to prevent overlap.
 * @property {boolean} flip - If true, the floating element will flip its position when necessary.
 * @property {string|null} [arrowId] - The ID of the arrow element used in floating placement. Null if no arrow is used.
 * @property {boolean} hide - If true, hides the floating element.
 * @property {boolean} focus - If true, the floating element will gain focus when shown.
 * @property {boolean} size - If true, adjusts the size of the floating element automatically.
 * @property {string|null} [width] - Specifies the width of the floating element, or null for default behavior.
 * @property {boolean} animationFrame - If true, triggers animations on frame updates.
 * @property {boolean} layoutShift - If true, allows layout shift during floating element repositioning.
 * @property {boolean} elementResize - If true, listens for resize events on the floating element.
 * @property {boolean} ancestorResize - If true, listens for resize events on the ancestor elements of the floating element.
 * @property {boolean} ancestorScroll - If true, listens for scroll events on ancestor elements of the floating element.
 */

/**
 * Model representing offset behavior for positioning.
 *
 * @typedef {Object} OffsetModel
 * @property {number} MainAxis - The offset along the main axis (e.g., horizontal or vertical axis depending on context).
 * @property {number} CrossAxis - The offset along the cross axis, perpendicular to the main axis.
 * @property {number|null} [AlignmentAxis] - The offset along the alignment axis, or null if not specified.
 *
 */
