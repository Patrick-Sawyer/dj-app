import styled from 'styled-components'
import React from 'react'

interface Props {
  children: React.ReactNode;
}

export function Ellipsis ({ children }: Props) {
  return (
    <Wrapper>
      <Inner>{children}</Inner>
    </Wrapper>
  )
}

const Wrapper = styled.span`
  display: table;
  table-layout: fixed;
  width: 100%;
`

const Inner = styled.span`
  text-overflow: ellipsis;
  white-space: nowrap;
  display: table-cell;
  overflow: hidden;
`
