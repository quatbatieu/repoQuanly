import styled from 'styled-components';

export const Content = styled.div`
    background-color: black !important;
    filter: drop-shadow(rgba(0, 0, 0, 0.07) 0px 4px 3px) drop-shadow(rgba(0, 0, 0, 0.06) 0px 2px 2px);
    border-radius: 8px;
    padding: 12px;
`

export const Text = styled.span`
    display: block;
    color: white;
`

export const UpDown = styled.span`
    display: inline-block;
    color: ${props => props.type === "GT" ? "#00FF23" : props.type === "LT" ?  "#FF3D58" : "white"};
`

export const Container = styled.div`
    max-width: 250px;
    background-color: transparent !important;
    ${props => props.axis === "left" ? `
        top: ${props.top + 34 + "px" || 0};
        left: ${props.left + "px" || 0};
    ` : `
        top: ${props.top + 34 + "px" || 0};
        left: ${props.left + "px" || 0};
    `}

    visibility: ${props => props.visibility};
    /* visibility: visible; */
    transition: .3s;
    position: absolute;
    z-index: 888;
    overflow: auto !important;
    &:hover {
        visibility: visible;
    }

    &::before {
        content: "";
        position: absolute;
        height: 0px;
        width: 0px;
        top: 10px;
        left: 12px;
        border-width: 6px;
        border-color: transparent #000000 transparent transparent;
        border-style: solid;
        z-index: 999;

        ${props => props.axis === "right" && `
            left: unset;
            right: 12px;
            transform: rotate(180deg)
        `}
    }

    canvas {
        width: 100% !important;
    }
`

export const Header = styled.div`
    max-width: 988px;
    height: 78px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;

    border-bottom: 1px solid #EAEDF3;
    width: 100%;
`

export const ChartContainer = styled.div`
    border: 1px solid #EAEDF3;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.04);
    border-radius: 4px;

    position: relative;
    max-width: 988px;

    display: flex;
    align-items: center;
    flex-flow: column;
    margin: 0 auto;
    padding-bottom: 30px;
`;

export const ChartContent = styled.div`
    max-width: 908px;
    width: 100%;
    position: relative;
`

export const DoughnutContainer = styled.div`
    max-width: 140px;
    position: relative;
`

export const Percent = styled.div`
    font-style: normal;
    font-weight: 500;
    font-size: 32px;
    line-height: 16px;
    text-align: center;
    color: ${props => props.type === "GT" ? "#00877C" : props.type === "LT" ?  "#FF3D58" : "#00877C"};

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-45%, -35%);

    span {
        font-size: 12px;
    }
`;

export const RightContent = styled.div`
    width: 208px;
    min-width: 208px;

    @media (max-width: 775px) {
        align-content: flex-start;
        width: 100%;

        > div > div {
            justify-content: flex-start;
        }
    }
`

export const LineChartContainer = styled(ChartContainer)`
`;
export const LineChartContent =  styled(ChartContent)`
    display: flex;
    align-items: center;
    justify-items: space-between;
    flex-flow: row;
    gap: 22px;

    canvas {
        max-width: 700px;
        width: 100% !important;
    }

    @media (max-width: 1199px) {
        max-width: unset;
        canvas {
            max-width: unset;
        }
    }

    @media (max-width: 975px) {
        max-width: unset;
        justify-content: space-around;
        canvas {
            max-width: 500px !important;
        }
    }

    @media (max-width: 775px) {
        max-width: 100%;
        flex-flow: column;
        padding: 0 16px;
        canvas {
            max-width: 100% !important;
        }
    }
`
export const LineStatisticTitle = styled.span`
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 20px;

    color: #3E3F42;
    display: inline-block;

    span {
        font-size: 14px;
    }
`
export const LineStatisticValue = styled.span`
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 28px;
    display: flex;
    align-items: center;

    color: #222222;
    display: inline-block;
    width: 100%;
    margin-top: 16px;
    margin-left: 20px;
`

export const Circle = styled.span`
    margin-right: 8px;
    display: inline-block;
    width: 10px;
    height: 10px;
    min-width: 10px;
    min-height: 10px;
    border-radius: 50%;
    background: ${props => props.bg};
`

export const Divider = styled.div`
    width: 208px;
    height: 0px;
    border: 1px solid #EAEDF3;
    margin-top: 20px;
    margin-bottom: 20px;
`

export const MainDivider = styled.div`
    border: 1px solid rgba(0, 0, 0, 0.08);
    max-width: 988px;
    width: 100%;
    margin: 60px auto 74px auto;
`


export const Title = styled.div`
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 18px;

    display: flex;
    align-items: flex-end;
    text-transform: uppercase;
    color: #2E384D;
`

export const Line = styled.div`
    width: 4px;
    height: 14px;
    background: #E42310;
    margin-right: 12px;
`