import React, { useState } from 'react';
import LinesEllipsis from 'react-lines-ellipsis'
import responsiveHOC from 'react-lines-ellipsis/lib/responsiveHOC'

const ResponsiveEllipsis = responsiveHOC()(LinesEllipsis)

function EllipsisText({ text, lines, displayText }) {
  const [isEllipsis, setIsEllipsis] = useState(false);

  const onReflow = (rleState) => {
    setIsEllipsis(rleState.text !== text);
  }

  return (
    <div>
      <ResponsiveEllipsis
        text={text}
        maxLine={lines}
        ellipsis='...'
        trimRight
        basedOn='letters'
        onReflow={onReflow}
      />
      {isEllipsis && <span className="blue-text"> {displayText}</span>}
    </div>
  );
}

export default EllipsisText;
