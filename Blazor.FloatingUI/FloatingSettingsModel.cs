using Blazor.FloatingUI.Models;

namespace Blazor.FloatingUI;

public class FloatingSettingsModel
{
    /// <summary>
    /// <see cref="FloatingStrategyType"/>
    /// </summary>
    public string? Strategy { get; set; }

    /// <summary>
    /// <see cref="FloatingPlacementType"/>
    /// </summary>
    public string? Placement { get; set; }

    public bool AutoPlacement { get; set; }

    public int? Offset { get; set; }

    public OffsetModel? OffsetModel { get; set; }

    public bool Shift { get; set; }

    public bool Flip { get; set; }

    public string? ArrowId { get; set; }

    public bool Hide { get; set; }

    public bool Focus { get; set; }

    public bool Size { get; set; }

    public string? Width { get; set; }

    public bool AnimationFrame { get; set; }

    public bool LayoutShift { get; set; }

    public bool ElementResize { get; set; }

    public bool AncestorResize { get; set; }

    public bool AncestorScroll { get; set; }

    public static FloatingSettingsModel Default => new()
    {
        Strategy = FloatingStrategyType.Absolute,
        Placement = FloatingPlacementType.Bottom,
        AutoPlacement = false,
        Shift = true,
        Flip = true,
        Hide = true,
        ArrowId = null,
        Offset = 0,
        Focus = true,
        OffsetModel = null,
        Width = null,
        Size = true,
        AnimationFrame = false,
        LayoutShift = true,
        ElementResize = true,
        AncestorResize = true,
        AncestorScroll = true,
    };
}
