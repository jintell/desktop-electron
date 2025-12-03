import { test, vi, expect } from 'vitest';
import type { Mock } from 'vitest';
import {createTray} from "./tray.js";
import {BrowserWindow, app, Menu} from "electron";

vi.mock('electron', () => {
    class MockTray {
        setContextMenu = vi.fn();
        setToolTip = vi.fn();
    }

    return {
        Tray: MockTray,
        app: {
            getAssetPath: vi.fn().mockReturnValue('/'),
            getAppPath: vi.fn().mockReturnValue('/'),
            dock: {
                show: vi.fn(),
            },
            quit: vi.fn(),
        },
        Menu: {
            buildFromTemplate: vi.fn(),
        },
    };
});

const mainWindow = {
    show: vi.fn()
} satisfies Partial<BrowserWindow> as any as BrowserWindow;

test("", ()=> {
    createTray(mainWindow);
    // expect(mainWindow.show).toHaveBeenCalled();

    const calls = (Menu.buildFromTemplate as any as Mock).mock.calls;
    const args = calls[0] as Parameters<typeof Menu.buildFromTemplate>;
    const template = args[0];
    expect(template).toHaveLength(3);

    template[0]?.click?.(null as any, null as any, null as any);
    expect(mainWindow.show).toHaveBeenCalled();
    // expect(app.dock.show).toHaveBeenCalled();

    template[2]?.click?.(null as any, null as any, null as any);
    expect(app.quit).toHaveBeenCalled();
})