import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { makeIcon } from '@apollosproject/ui-kit';

const HandShake = makeIcon(({ size = 32, fill, ...otherProps } = {}) => (
  <Svg
    height={size}
    viewBox="0 0 60 56"
    width={size}
    xmlns="http://www.w3.org/2000/svg"
    {...otherProps}
  >
    <Path
      id="Shape"
      d="m55.267 6.451c-3.1554558-3.35211626-7.5148869-5.3111371-12.1165923-5.44489779s-9.067568 1.56872974-12.4124077 4.73189779l-.759.717c-6.5735692-6.97204268-17.5544573-7.29506924-24.5265-.7215-6.97204268 6.5735692-7.29506923 17.5544573-.7215 24.5265l1.709 1.811c-.72160926 1.6707444-.49100043 3.6002404.60402603 5.0538647 1.09502647 1.4536244 2.88597573 2.2077038 4.69097397 1.9751353-.3055963 1.5905926.1720173 3.2311243 1.2836411 4.4091167 1.1116239 1.1779925 2.7217354 1.7498317 4.3273589 1.5368833-.3056119 1.5903264.17189 3.2306135 1.2833306 4.4084235s2.7213086 1.7495397 4.3266694 1.5365765c-.3977455 2.159889.6375285 4.3308072 2.5662286 5.3812539 1.9287001 1.0504466 4.3140443.7425329 5.9127714-.7632539 5.707-5.388 5.528-5.119 6.067-6.027 1.6692105.8213502 3.6548227.6584576 5.1678555-.4239524 1.5130328-1.0824101 2.3084313-2.9090275 2.0701445-4.7540476 1.5902839.29806 3.2271413-.183293 4.40292-1.2947727 1.1757786-1.1114798 1.7483285-2.7187102 1.54008-4.3232273 2.1725901.3991013 4.3540217-.651796 5.3960356-2.599522 1.042014-1.9477259.7056506-4.3456185-.8320356-5.931478 6.3320448-6.6683085 6.3408305-17.1250606.02-23.804zm-46.401 29.749c-1.16834353-1.2413826-1.11199041-3.1940627.126-4.366l5.2-4.91c1.2434509-1.1485232 3.1797539-1.0819347 4.3413661.1492975 1.1616122 1.2312323 1.1155097 3.1681312-.1033661 4.3427025l-5.2 4.91c-1.2404948 1.1686738-3.1930008 1.1122999-4.364-.126zm5.611 5.946c-1.1694565-1.2409595-1.1130772-3.1945493.126-4.366l5.2-4.91c1.2401554-1.1700152 3.1939847-1.1131553 4.3639999.1270001 1.1700153 1.2401553 1.1131555 3.1939846-.1269999 4.3639999l-5.2 4.911c-1.2419354 1.1661242-3.193265 1.1075351-4.363-.131zm5.61 5.945c-1.1679654-1.2413158-1.1111609-3.1936907.127-4.365l5.2-4.91c1.2480734-1.0957063 3.13936-1.0075892 4.2801476.1994167 1.1407875 1.207006 1.1221636 3.1002527-.0421476 4.2845833l-5.2 4.91c-1.2396529 1.1709893-3.1938231 1.1154756-4.365-.124zm9.975 6.072c-.8022399.7570458-1.9474192 1.0285951-3.0041601.7123579-1.0567408-.3162372-1.8644991-1.172217-2.119-2.2455-.254501-1.0732831.0829202-2.2008121.8851601-2.9578579l5.2-4.911c1.2434509-1.1485232 3.1797539-1.0819347 4.3413661.1492975 1.1616122 1.2312323 1.1155097 3.1681312-.1033661 4.3427025zm23.653-18.117c-.5943646.5637066-1.3888588.8673276-2.2076842.8436805-.8188255-.023647-1.5944735-.3726125-2.1553158-.9696805l-13.326-14.12c-.3791435-.4017871-1.0122128-.4201434-1.414-.0409999-.4017871.3791434-.4201434 1.0122127-.041 1.4139999l13.329 14.119c.7572244.8020612 1.0290341 1.9471708.7130408 3.003977-.3159932 1.0568062-1.1717823 1.8647551-2.245 2.1195-1.0732176.254745-2.2008164-.0824158-2.9580408-.884477l-13.328-14.121c-.2452628-.2599107-.6105557-.369232-.9582764-.2867835s-.6250422.3441408-.7275.6865c-.1024579.3423592-.0144864.7133728.2307764.9732835l13.324 14.117c1.0521185 1.113918 1.1268695 2.8313483.1755129 4.0324674s-2.6402709 1.5216232-3.9655129.7525326c.2074808-1.4285301-.2065304-2.8775412-1.1373998-3.9808221s-2.2895282-1.755266-3.7326002-1.7911779c-1.1-.029-.7.387-.672-.713.0398258-1.3489527-.4582125-2.65841-1.3844146-3.639944-.9262021-.9815341-2.2045921-1.5546305-3.5535854-1.593056-1.1-.035-.705.4-.672-.713.0392875-1.3489738-.4590666-2.6582757-1.3853715-3.6397201-.926305-.9814443-2.2046375-1.5545885-3.5536285-1.5932799-1.107-.031-.705.409-.672-.713.0539715-2.054285-1.1319304-3.9397414-3.006957-4.7807379-1.8750266-.8409966-4.0717739-.4727433-5.570043.9337379-7.15 6.749-4.683 4.423-5.216 4.926l-1.418-1.5c-5.81500613-6.1681922-5.52869223-15.8824939.6395-21.6975 6.1681922-5.81500613 15.8824939-5.52869223 21.6975.6395l-8.19 7.734c-.7766209.7446837-1.2337449 1.7618294-1.275 2.837-.1 4.107 6.009 6.693 9.742 3.16l7.464-7.044c.1927817-.1822656.4500905-.2804541.7152872-.2729521s.5165432.1200796.6987128.3129521c1.962 2.079 14.28 15.133 16.162 17.126.5622674.5952757.8649019 1.3896104.8412697 2.2081086s-.3715933 1.5940485-.9672697 2.1558914zm.171-7.23-14.753-15.633c-.5462023-.5785892-1.2998837-.9164935-2.095232-.9393732-.7953483-.0228796-1.5672081.2711398-2.145768.8173732l-7.465 7.046c-.7927943.7483465-1.8509894 1.1501315-2.9406761 1.116542-1.0896866-.0335894-2.1211264-.4997871-2.8663239-1.295542-.3751748-.3977504-.5766463-.9284488-.5599487-1.4749675.0166976-.5465188.2501916-1.0639278.6489487-1.4380325l10.4-9.823c6.023093-5.70190994 15.4860084-5.58900773 21.371347.25498192 5.8853386 5.84398968 6.0649558 15.30587378.405653 21.36901808z"
      transform="translate(0 -1)"
      fill={fill}
      stroke={fill}
      strokeWidth="2"
    />
  </Svg>
));

HandShake.propTypes = {
  size: PropTypes.number,
  fill: PropTypes.string,
};

export default HandShake;
