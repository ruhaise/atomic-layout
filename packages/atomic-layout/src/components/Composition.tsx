import * as React from 'react'
import styled from 'styled-components'
import {
  GenericProps,
  BoxProps,
  GridProps,
  AreasMap,
  AreaComponent,
  parseTemplates,
  generateComponents,
  applyStyles,
  warn,
} from '@atomic-layout/core'
import Box from './Box'
import { withPlaceholder } from '../utils/withPlaceholder'

type ChildrenFunction = (areas: AreasMap) => React.ReactNode

interface CompositionProps extends GenericProps, GridProps {
  [propName: string]: any
  children: ChildrenFunction | React.ReactNode
  inline?: boolean
}

const CompositionWrapper = styled.div<CompositionProps>`
  && {
    ${applyStyles};
    display: ${({ inline }) => (inline ? 'inline-grid' : 'grid')};
  }
`

const createAreaComponent = (areaName: string): AreaComponent => (
  props: BoxProps,
) => <Box area={areaName} {...props} />

const Composition: React.FC<CompositionProps> = ({
  children,
  ...restProps
}) => {
  const areasList = parseTemplates(restProps)
  const Areas = generateComponents(
    areasList,
    createAreaComponent,
    withPlaceholder,
  )
  const hasAreaComponents = Object.keys(Areas).length > 0
  const childrenType = typeof children
  const hasChildrenFunction = childrenType === 'function'

  // Warn when provided "areas"/"template" props, but didn't use a render prop pattern.
  warn(
    !(hasAreaComponents && !hasChildrenFunction),
    `Failed to render 'Composition' with template areas ["${Object.keys(
      Areas,
    ).join(
      '", "',
    )}"]: expected children to be a function, but got: ${childrenType}. Please provide render function as children, or remove assigned template props.`,
  )

  return (
    <CompositionWrapper {...restProps}>
      {hasAreaComponents && hasChildrenFunction
        ? (children as ChildrenFunction)(Areas)
        : children}
    </CompositionWrapper>
  )
}

export default Composition
