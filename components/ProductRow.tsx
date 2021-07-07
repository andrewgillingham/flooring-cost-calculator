import { ChangeEvent, useEffect, useState } from "react";
import { useStickyState } from "../utils/hooks";
import styles from "../styles/Home.module.css";
import { Room } from "../utils/interfaces";

interface Props {
  title: string;
  footage: number;
}

export default function ProductRow({ title, footage }: Props) {
  const [gallonsNeeded, setGallonsNeeded] = useState<number>(0);
  const [coats, updateCoats] = useStickyState(0, `${title} coats`);
  const [coverage, updateCoverage] = useStickyState(0, `${title} coverage`);
  const [cost, updateCost] = useStickyState(0, `${title} cost`);

  const handleCoatChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCoats(e.target?.value);
  };

  const handleCoverageChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCoverage(e.target.value);
  };

  const handleCostChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateCost(e.target?.value);
  };

  const calcCoverage = (footage: number, coverage: number) => {
    const result: number = footage / coverage;
    setGallonsNeeded(result);
    return result;
  };
  const currFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  useEffect(() => {
    calcCoverage(footage, coverage);
  }, [footage, coverage]);

  return (
    <div>
      <h3>{title}</h3>
      <div className={styles.productrow}>
        <p>
          <label>
            Coats
            <input value={coats} onChange={handleCoatChange} type="number" />
          </label>
        </p>
        <p>
          <label>
            Coverage per Gallon
            <input value={coverage} onChange={handleCoverageChange} type="number" />
          </label>
        </p>
        <p>
          <label>
            $ per Gallon
            <input value={cost} onChange={handleCostChange} type="currency" />
          </label>
        </p>
      </div>
      <p>Number of Gallons Needed = {Math.ceil(gallonsNeeded * coats) || 0}</p>
      <p>Total Cost: {currFormatter.format(cost * Math.ceil(gallonsNeeded * coats) || 0)}</p>
    </div>
  );
}
