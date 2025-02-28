import "./App.css";
import { useState } from "react";

const rates = {
  light: {
    bottled: 52.87,
    keg: 10.57,
  },
  mid: {
    bottled: 61.57,
    keg: 33.11,
  },
  heavy: {
    bottled: 61.57,
    keg: 43.39,
  },
};

const getRate = (abv, fromTap) => {
  const isHeavy = abv > 3.5;
  const isMid = abv > 3;

  if (isHeavy) {
    return rates.heavy[fromTap ? "keg" : "bottled"];
  }

  if (isMid) {
    return rates.mid[fromTap ? "keg" : "bottled"];
  }

  return rates.light[fromTap ? "keg" : "bottled"];
};

const round = (money) => Math.round(money * 100) / 100;

const onInputChange = (setter) => (evt) => setter(evt.target.value);

const getClassName = (currentStep, stepNumber, otherClasses = "") =>
  `step ${currentStep === stepNumber ? "visible" : "hidden"} ${otherClasses}`;

const QuickButton = (props) => (
  <button type="button" onClick={() => props.setter(props.value)}>
    {props.label || props.value}
  </button>
);

const App = () => {
  const [step, setStep] = useState(0);

  const [fromTap, setFromTap] = useState(false);
  const [abv, setAbv] = useState(5);
  const [qty, setQty] = useState(1);
  const [vol, setVol] = useState(375);
  const [cost, setCost] = useState(10);

  const rate = getRate(abv, fromTap);
  const litres = (qty * vol) / 1000;
  const lals = litres * (abv / 100 - 1.15 / 100);
  const excise = lals * rate;

  const gst = cost - cost / 1.1;
  const tax = gst + excise;
  const taxPercent = (tax / cost) * 100;

  return (
    <div className="app">
      <div className={getClassName(0, step, "disclaimer")}>
        <p>
          These rates are applicable to <u>beer only</u>, sold in Australia from
          3 Feb 2025 to 3 Aug 2025.
        </p>
        <p>
          🔗{" "}
          <a
            href="https://www.ato.gov.au/businesses-and-organisations/gst-excise-and-indirect-taxes/excise-on-alcohol/excise-duty-rates-for-alcohol"
            target="_blank"
            rel="noreferrer"
          >
            source (ato.gov.au)
          </a>
        </p>
      </div>

      <div className={getClassName(1, step)}>
        <p className="question">Are you drinking from a keg?</p>

        <div className="quickbuttons large">
          <button
            className={fromTap ? "active" : ""}
            onClick={() => setFromTap(true)}
          >
            Yes
          </button>
          <button
            className={!fromTap ? "active" : ""}
            onClick={() => setFromTap(false)}
          >
            No
          </button>
        </div>
      </div>

      <div className={getClassName(2, step)}>
        <p className="question">What % ABV is the beer?</p>
        <input type="number" value={abv} onChange={onInputChange(setAbv)} />

        <div className="quickbuttons">
          <QuickButton setter={setAbv} value={3} label="3% or less" />
          <QuickButton setter={setAbv} value={3.5} label="3.5%" />
          <QuickButton setter={setAbv} value={5} label="5%" />
        </div>
      </div>

      <div className={getClassName(3, step)}>
        <p className="question">How many drinks did you buy?</p>
        <input type="number" value={qty} onChange={onInputChange(setQty)} />

        <div className="quickbuttons">
          <QuickButton setter={setQty} value={1} label="1" />
          <QuickButton setter={setQty} value={4} label="4" />
          <QuickButton setter={setQty} value={6} label="6" />
          <QuickButton setter={setQty} value={16} label="16" />
          <QuickButton setter={setQty} value={24} label="24" />
        </div>
      </div>

      <div className={getClassName(4, step)}>
        <p className="question">What's the volume in ml of each drink?</p>
        <input type="number" value={vol} onChange={onInputChange(setVol)} />

        <div className="quickbuttons">
          <QuickButton setter={setVol} value={330} label="330" />
          <QuickButton setter={setVol} value={375} label="375" />
          <QuickButton setter={setVol} value={425} label="Schooner" />
          <QuickButton setter={setVol} value={570} label="Pint" />
        </div>
      </div>

      <div className={getClassName(5, step)}>
        <p className="question">What did you pay ($)</p>
        <input type="number" value={cost} onChange={onInputChange(setCost)} />
      </div>

      <div className={getClassName(6, step, "summary")}>
        <p>You paid:</p>

        <ul className="summary-list">
          <li>
            <span className="highlight">${round(excise)}</span> alcohol excise
          </li>
          <li>
            + <span className="highlight">${round(gst)}</span> GST
          </li>
          <li className="total">
            = <span className="highlight">${round(tax)}</span> total tax
          </li>
        </ul>

        <p>
          Which is <span className="highlight">{round(taxPercent)}%</span> of
          the total cost.
        </p>
      </div>

      <footer className="footer">
        <button type="button" onClick={() => setStep(Math.max(0, step - 1))}>
          Back
        </button>

        {step < 6 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Next
          </button>
        ) : (
          <button type="restart" onClick={() => setStep(1)}>
            Reset
          </button>
        )}
      </footer>
    </div>
  );
};

export default App;
