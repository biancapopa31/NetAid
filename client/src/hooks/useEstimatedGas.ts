import {BrowserProvider, ethers} from "ethers";
import {useEffect, useState} from "react";

type ContractFunction<F extends Function> = F & {
    estimateGas: (p: Parameters<F>) => Promise<number>;
}

export function useEstimatedGas<F extends (...args: any[]) => any>(fn: ContractFunction<F>, args: Parameters<F>, condition?: boolean) {
    const [gas, setGas] = useState<{ gas: number } | undefined>(undefined);
    useEffect(() => {
        if (condition === false) return;
        fn.estimateGas(args).then((gas) => {
                setGas({
                    gas: gas,
                })
        });
    }, [fn, args, condition]);

    return gas;
}