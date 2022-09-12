import styled from 'styled-components';
import { SelectFloorButtons } from './SelectFloorButtons';

type Props = {};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const RightPanelWrapper = styled(Wrapper)`
  justify-content: space-between;
  width: 80%;
`;

export const RightSidePanel = (props: Props) => {
  return (
    <RightPanelWrapper>
      <SelectFloorButtons />
    </RightPanelWrapper>
  );
};
