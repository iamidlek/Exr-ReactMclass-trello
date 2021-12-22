import React from "react";
import { useRecoilState } from "recoil";
import { hourSelector, minuteState } from "./atoms";

function App() {
  // atom
  const [minutes, setMinutes] = useRecoilState(minuteState);
  // selector 로 atom의 값에 영향을 받고 영향을 줌
  const [hours, setHours] = useRecoilState(hourSelector);
  const onMinutesChange = (event: React.FormEvent<HTMLInputElement>) => {
    setMinutes(+event.currentTarget.value);
  };
  const onHoursChange = (event: React.FormEvent<HTMLInputElement>) => {
    setHours(+event.currentTarget.value);
  };
  return (
    <div>
      <input
        value={minutes}
        onChange={onMinutesChange}
        type="number"
        placeholder="Minutes"
      />
      <input
        onChange={onHoursChange}
        value={hours}
        type="number"
        placeholder="Hours"
      />
    </div>
  );
}

export default App;
