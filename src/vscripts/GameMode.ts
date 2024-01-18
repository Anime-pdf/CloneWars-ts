import { reloadable } from "./lib/tstl-utils";

declare global {
    interface CDOTAGameRules {
        Addon: GameMode;
    }
}

@reloadable
export class GameMode {
    public static Precache(this: void, context: CScriptPrecacheContext) {}

    public static Activate(this: void) {
        GameRules.Addon = new GameMode();
    }

    constructor() {
        this.configure();

        ListenToGameEvent("game_rules_state_change", () => this.OnStateChange(), undefined);
        ListenToGameEvent('npc_spawned', event => this.OnNpcSpawned(event), undefined);
    }

    private configure(): void {
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.GOODGUYS, 5);
        GameRules.SetCustomGameTeamMaxPlayers(DotaTeam.BADGUYS, 5);

        GameRules.SetSameHeroSelectionEnabled(true);


        // Faster drafting
        GameRules.SetShowcaseTime(0);
        GameRules.SetHeroSelectionTime(20);
        GameRules.SetHeroSelectPenaltyTime(0);
        GameRules.SetPreGameTime(60);
        GameRules.GetGameModeEntity().SetDraftingBanningTimeOverride(10);
        GameRules.GetGameModeEntity().SetDraftingHeroPickSelectTimeOverride(30);
        GameRules.SetStrategyTime(30);

        // Shop + courier
        GameRules.GetGameModeEntity().SetCanSellAnywhere(true);
        GameRules.GetGameModeEntity().SetLoseGoldOnDeath(false);
        GameRules.SetUseUniversalShopMode(true);
        GameRules.GetGameModeEntity().SetUseTurboCouriers(true);
        GameRules.GetGameModeEntity().SetFreeCourierModeEnabled(true);

        // 2x Gold & Exp
        GameRules.GetGameModeEntity().SetModifyExperienceFilter(event => this.ModifyExperienceFilter(event), this);
        GameRules.GetGameModeEntity().SetModifyGoldFilter(event => this.ModifyGoldFilter(event), this);
    }

    ModifyExperienceFilter(event: ModifyExperienceFilterEvent): boolean {
        event.experience *= 2;
        return true;
    }
    ModifyGoldFilter(event: ModifyGoldFilterEvent): boolean {
        event.gold *= 2;
        return true;
    }

    public OnStateChange(): void {
        const state = GameRules.State_Get();

        // Add 4 bots to lobby in tools
        if (IsInToolsMode() && state == GameState.CUSTOM_GAME_SETUP) {
            for (let i = 0; i < 3; i++) {
                Tutorial.AddBot("npc_dota_hero_lina", "", "", false);
            }
        }

        if (state === GameState.PRE_GAME) {
            Timers.CreateTimer(0.2, () => this.StartGame());
        }
    }
    public OnNpcSpawned(event: NpcSpawnedEvent): void {
        const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC;
        if (unit.IsAncient()) {
            unit.SetBaseHealthRegen(0);
        }
    }

    private StartGame(): void {
        print("Game starting!");
    }

    public Reload() {
        print("Script reloaded!");
    }
}
