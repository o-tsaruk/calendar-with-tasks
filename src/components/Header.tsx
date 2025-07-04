import styled from 'styled-components';
import { CountrySelect } from './CountrySelect';

const HeaderWrapper = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-secondary);
  background-color: var(--bg-primary);
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ArrowButton = styled.button<{ $rotate?: boolean }>`
  background: #d2e3f0;
  border: none;
  padding: 4px 10px;
  border-radius: 6px;
  cursor: pointer;

  img {
    width: 20px;
    height: 20px;
    transform: ${({ $rotate }) => ($rotate ? 'rotate(180deg)' : 'none')};
  }

  &:hover {
    opacity: 0.7;
  }
`;

const Title = styled.h2`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  font-weight: 500;
  margin: 0;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  font-size: 16px;
  border-radius: 6px;
  border: 1px solid var(--border-control);
`;

type HeaderProps = {
  month: number;
  year: number;
  onPrev: () => void;
  onNext: () => void;
  onSearch: (query: string) => void;
};

export const Header: React.FC<HeaderProps> = ({
  month,
  year,
  onPrev,
  onNext,
  onSearch,
}) => {
  const monthName = new Date(1, month).toLocaleString('default', {
    month: 'long',
  });

  return (
    <HeaderWrapper>
      <NavSection>
        <ArrowButton onClick={onPrev} $rotate={true}>
          <img src='/arrow.svg' alt='Previous Month' />
        </ArrowButton>
        <ArrowButton onClick={onNext}>
          <img src='/arrow.svg' alt='Next Month' />
        </ArrowButton>
        <CountrySelect />
      </NavSection>
      <Title>
        {monthName} {year}
      </Title>
      <SearchInput
        type='text'
        placeholder='Find a task'
        onChange={(e) => onSearch(e.target.value)}
      />
    </HeaderWrapper>
  );
};
