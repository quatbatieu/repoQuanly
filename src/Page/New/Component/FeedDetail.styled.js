import { tablet , galaxy_Fold } from 'constants/breakpoints'
import { smallScreenLimit } from 'constants/breakpoints'
import { blackRaisin } from 'constants/colors'
import { cultured } from 'constants/colors'
import { blueSapphire } from 'constants/colors'
import styled from 'styled-components'

export const Container = styled.div`
  min-height: calc(100vh - 405px);
  overflow: hidden;
`

export const Content = styled.div`
  /* padding: 36px 0px 80px 0px; */

  display: flex;
  gap: 20px;

  @media (max-width: ${tablet}) {
    flex-flow: column;

    /* padding: 40px 16px; */
  }
`
export const IFrameResponsive = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; // for aspect ratio 16:9
  position: relative;
  margin-bottom: 8px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  
`
export const Divider = styled.div`
  width: 100%;
  height: 2px;
  margin-bottom: 28px;
  margin-top: ${(props) => props.marginTop || 0}px;

  /* background: ${blueSapphire}; */
  border-radius: 12px 12px 0px 0px;
`

export const Left = styled.div`
  width: 100%;
  flex: 1;

  @media (max-width: ${smallScreenLimit}) {
    padding-left: 16px;
  }

  @media (max-width: ${tablet}) {
    padding-left: 0;
  }
`
export const Right = styled.div`
  @media (max-width: ${smallScreenLimit}) {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
`

export const TableNavContainer = styled.div`
  margin-top: 40px;

  @media (max-width: ${smallScreenLimit}) {
    margin-top: 0px;
    margin-bottom: 20px;
  }
`

export const FeedDetailContainer = styled.div`
  display: flex;
  flex-flow: column;
  width: 100%;
`

export const Title = styled.div`
  font-style: normal;
  margin: 0;
  margin-bottom: 8px;

  color: ${blackRaisin};
`

export const Author = styled.div`
  display:flex;
  justify-content: space-between;
  align-items: center;
  font-style: normal;
  margin: 0;

  color: rgba(117, 117, 117, 0.7);

  span {
    color: rgb(117, 117, 117);
  }
  @media (max-width: ${tablet}) {
    display:block;
    display:flex;
    justify-content: space-between;
    align-items: center;
  }
`

export const DividerSmall = styled.div`
  width: 100%;
  height: 1px;
  background: rgba(0, 0, 0, 0.08);
  margin: 24px 0;

  @media (max-width: ${smallScreenLimit}) {
    width: 100%;
  }
`

export const Image = styled.div`
  width: 100%;
  height: 396px;
  aspect-ratio: 16 / 9;
  margin-top: 20px;
  background: url(${(props) => props.bg}) center center no-repeat;
  background-size: cover;
  background-color: ${cultured};
  margin: 0 auto;

  @media (max-width: ${smallScreenLimit}) {
    width: 100%;
  }
  @media (max-width: ${tablet}) {
    height: 250px;
  }
  @media (max-width: ${galaxy_Fold}) {
    height: 160px;
  }
`

export const ImageDesc = styled.div`
  text-align: center;
  width: 100%;
  color: ${blackRaisin};
`

export const Description = styled.div`
  margin-top: 24px;
  margin-bottom: 40px;
  max-width: 100%;
  > p {
    word-wrap: break-word;
  }

  img {
    width: 100% !important;
  }
`

export const FeedContainer = styled.div`
  @media (max-width: ${smallScreenLimit}) {
    display: flex;
    flex-flow: row;
    flex-wrap: wrap;
    justify-content: center;

    gap: 20px;
  }
`

export const FeedContent = styled.div`
  display: flex;
  flex-flow: column;
  @media (max-width: ${smallScreenLimit}) {
    justify-content: space-between;
    width: 100%;
  }

  @media (max-width: ${tablet}) {
    justify-content: center;
    background-color: white;
    transform: translateY(110%);
    transition: transform 0.5s;
  }
`

export const FeedWrapper = styled.div`
  width: 100%;
  @media (max-width: ${smallScreenLimit}) {
    align-items: center;
    display: flex;
    flex-flow: column;
  }
`

export const styleNew = styled.div`
  @media (max-width: ${tablet}) {
    padding: 0 15px;
  }
`

export const Share = styled.div`
  padding: 5px 10px;
  background-color: var(--primary-button-color);
  color: white;
  cursor: pointer;
  border-radius: 5px;
  @media (max-width: ${galaxy_Fold}) {
    padding: 3px 5px;
  }
`

export const MostViewContainer = styled.div``
