import tron from "../assets/networks/tron.svg";
import ethereum from "../assets/networks/ethereum.svg";
import bnb from "../assets/networks/bnb.svg";
import polygon from "../assets/networks/polygon.svg";
import solana from "../assets/networks/solana.svg";
import ton from "../assets/networks/ton.svg";
import usdt from "../assets/networks/usdt.svg";

const networkIcons: Record<string, string> = {
    USDTTRC20: tron,
    USDTERC20: ethereum,
    USDTBSC: bnb,
    USDTMATIC: polygon,
    USDTSOL: solana,
    USDTTON: ton,
    usdt: usdt,
};

const sizeMap = {
    xs: { wrapper: "h-4 w-4", img: "h-2.5 w-2.5", text: "text-[8px]" },
    sm: { wrapper: "h-5 w-5", img: "h-3 w-3", text: "text-[9px]" },
    md: { wrapper: "h-7 w-7", img: "h-4 w-4", text: "text-[10px]" },
    lg: { wrapper: "h-10 w-10", img: "h-7 w-7", text: "text-xs" },
} as const;

interface NetworkIconProps {
    currency: string;
    size?: keyof typeof sizeMap;
}

export function NetworkIcon({ currency, size = "sm" }: NetworkIconProps) {
    const icon = networkIcons[currency];
    const { wrapper, img, text } = sizeMap[size];

    if (!icon) {
        return (
            <div
                className={`flex ${wrapper} shrink-0 items-center justify-center rounded-full bg-muted`}
            >
                <span className={`${text} font-bold text-muted-foreground`}>
                    ?
                </span>
            </div>
        );
    }

    return (
        <div
            className={`flex ${wrapper} shrink-0 items-center justify-center rounded-full bg-muted`}
        >
            <img src={icon} alt={currency} className={`${img} object-contain`} />
        </div>
    );
}