import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const BrandIcon = makeIcon(({ size = 40, fill, ...otherProps } = {}) => (
  <Svg
    id="prefix__Layer_1"
    data-name="Layer 1"
    width={size}
    height={size}
    fill={fill}
    viewBox="0 0 32 32"
    {...otherProps}
  >
    <Path
      className="prefix__cls-1"
      d="M16.435 13.654L4.17 13.012a12.11 12.11 0 01.845-2.315l11.282.606a.161.161 0 00.056-.005.3.3 0 00.16-.085.322.322 0 00.096-.224l.024-9.629a.22.22 0 00-.125-.206.226.226 0 00-.132-.014.302.302 0 00-.122.054l-2.477 1.512a.028.028 0 00-.01.01 13.479 13.479 0 00.03 26.591l2.457 1.5a.285.285 0 00.122.054.224.224 0 00.132-.014.218.218 0 00.125-.206V13.877a.211.211 0 00-.2-.223zM13.644 16.7v11.267A12.216 12.216 0 013.8 16.05l9.81.608a.038.038 0 01.034.04zm-7.925-7.26a12.232 12.232 0 017.922-5.411l-.008 5.834zM20.323 3.245v-.873a.647.647 0 00-1.293 0v8.427a.647.647 0 00.606.645l7.872.511a12.1 12.1 0 01.568 2.36l-8.733-.389a.234.234 0 00-.058.003.316.316 0 00-.16.086.329.329 0 00-.096.224V29.648a.647.647 0 101.294 0v-.874a13.475 13.475 0 000-25.53zm0 6.946V4.597a12.263 12.263 0 016.617 6.025zm7.819 6.96a12.22 12.22 0 01-7.82 10.246V16.951z"
    />
  </Svg>
));

BrandIcon.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default BrandIcon;
