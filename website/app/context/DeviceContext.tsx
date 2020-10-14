/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useCallback } from 'react';
import constate from 'constate';

type DeviceType = 'MOBILE' | 'TABLET' | 'DESKTOP';

interface DeviceState {
  type: DeviceType;
}

interface DeviceHook {
  device: DeviceState;
  setDeviceType: (device: DeviceType) => void;
}

const useUser = () => {
  const [device, setDevice] = useState<DeviceState>({
    type: 'DESKTOP'
  });

  const setDeviceType = useCallback(
    (type: DeviceType) => {
      setDevice({
        ...device,
        type
      });
    },
    [device]
  );

  return { device, setDeviceType };
};

const [DeviceProvider, useDeviceContext] = constate<
  DeviceState,
  DeviceHook,
  []
>(useUser);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const withDevice = (Children: () => JSX.Element) => (props): JSX.Element => {
  const deviceProps = useDeviceContext();
  return (
    <>
      <Children {...props} {...deviceProps} />
    </>
  );
};

export { withDevice, useDeviceContext, DeviceProvider };
