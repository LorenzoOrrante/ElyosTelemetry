let currentLapNumber = 1;

export const getCurrentLapNumber = () => currentLapNumber;

export const resetCurrentLapNumber = () => {
  currentLapNumber = 1;
};

export const incrementCurrentLapNumber = () => {
  currentLapNumber += 1;
};

