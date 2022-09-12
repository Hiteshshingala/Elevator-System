import React, { SyntheticEvent, useState } from 'react';
import { Outlet } from 'react-router';
import styled from 'styled-components';
import { RightSidePanel } from './components/';
import { ElevatorSystemProvider } from './contexts/';

const OuterContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;

`;

const LeftContainer = styled.div`
  width: 50vw;
`;

const RightContainer = styled.div`
  width: 50vw;
`;

export const App = () => {

  return (
    <ElevatorSystemProvider>
      <OuterContainer>
        <LeftContainer>
            <Outlet />
        </LeftContainer>
        <RightContainer>
          <RightSidePanel />
        </RightContainer>
      </OuterContainer>
    </ElevatorSystemProvider>
  );
};
