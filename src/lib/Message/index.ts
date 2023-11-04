import {renderMsg} from './src/MessageIpm'
export function     text(cfg = "") {
    const textCfg = {
        type: "text",
        icon: ''
    }
    return renderMsg(textCfg, cfg);
}
