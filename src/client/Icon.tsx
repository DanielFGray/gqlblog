import * as React from 'react'
import PropTypes from 'prop-types'
import { IconDefinition } from '@fortawesome/fontawesome-common-types'

const FontAwesomeIcon = ({
  i,
  size,
  className = '',
  ...props
}: {
  i: IconDefinition;
  size: string | null;
  className: string;
} & React.SVGProps<SVGSVGElement>): JSX.Element => {
  if (! i) {
    return 'null'
  }
  const {
    icon: [width, height, , , svgPathData],
    iconName,
    prefix,
  } = i
  return (
    <svg
      aria-hidden="true"
      className={[
        'svg-inline--fa',
        `fa-${iconName}`,
        `fa-w-${Math.ceil((width / height) * 16)}`,
        size ? `fa-${size}` : '',
        className,
      ].join(' ')}
      data-icon={iconName}
      data-prefix={prefix}
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d={svgPathData} fill="currentColor" />
    </svg>
  )
}

FontAwesomeIcon.displayName = 'FontAwesomeIcon'

FontAwesomeIcon.propTypes = {
  className: PropTypes.string,
  i: PropTypes.object,
  size: PropTypes.oneOf([
    'lg',
    'xs',
    'sm',
    '1x',
    '2x',
    '3x',
    '4x',
    '5x',
    '6x',
    '7x',
    '8x',
    '9x',
    '10x',
  ]),
}

FontAwesomeIcon.defaultProps = {
  className: '',
  i: null,
  size: null,
}
export default FontAwesomeIcon
