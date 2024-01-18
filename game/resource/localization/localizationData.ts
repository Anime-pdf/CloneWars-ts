import { AbilityLocalization, LocalizationData, ModifierLocalization, StandardLocalization } from "~generator/localizationInterfaces";
import { Language } from "../languages";

export function GenerateLocalizationData(): LocalizationData
{
    // This section can be safely ignored, as it is only logic.
    //#region Localization logic
    // Arrays
    const Abilities: Array<AbilityLocalization> = new Array<AbilityLocalization>();
    const Modifiers: Array<ModifierLocalization> = new Array<ModifierLocalization>();
    const StandardTooltips: Array<StandardLocalization> = new Array<StandardLocalization>();    

    // Create object of arrays
    const localization_info: LocalizationData =
    {
        AbilityArray: Abilities,
        ModifierArray: Modifiers,
        StandardArray: StandardTooltips,        
    };
    //#endregion

    // Enter localization data below! 
    StandardTooltips.push({
        classname: "addon_game_name",
        name: "Clone Wars!!!",
        language_overrides:
        [
            {
                language: Language.Russian,
                name_override: "Ебейшая война клонов!!!"
            }
        ],
    });


    // Return data to compiler
    return localization_info;
}
