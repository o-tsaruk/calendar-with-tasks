import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = styled.header`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px;
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  background-color: #fff;
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ArrowButton = styled.button<{ $rotate?: boolean }>`
  background: var(--bg-secondary);
  border: none;
  padding: 4px 8px;
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
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
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
