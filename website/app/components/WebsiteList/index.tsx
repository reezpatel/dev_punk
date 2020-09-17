import React, { useState, useEffect } from 'react';
import { Website } from '@devpunk/types';
import { TiPin, TiPinOutline } from 'react-icons/ti';
import { useUserContext } from '../../context';
import {
  WebsiteContainer,
  WebsiteListContainer,
  Title,
  WebsiteItem,
  WebsiteIcon,
  WebsiteText,
  WebsiteAction
} from './style';
import { CONFIG } from '../../utils';

const { ALL_WEBSITE, PINNED_WEBSITE } = CONFIG.WEBSITE_IDS;

interface WebsiteListProps {
  websites: Website[];
  selected: string;
  onChange: (id: string) => void;
  visible: boolean;
}

type WebsiteList = (props: WebsiteListProps) => JSX.Element;

const WebsiteList: WebsiteList = ({
  websites,
  selected,
  onChange,
  visible
}) => {
  const handleWebsiteSelection = (id: string) => () => {
    onChange(id);
  };

  const user = useUserContext();

  const [pinnedWebsite, setPinnedWebsite] = useState<Record<string, boolean>>(
    {}
  );

  const [websiteList, setWebsiteList] = useState(websites);

  const handleButtonPin = (website: Website) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (pinnedWebsite[website._id]) {
      const index = user.user.pins.findIndex((pin) => pin._id === website._id);
      user.setPins(
        user.user.pins.slice(0, index).concat(user.user.pins.slice(index + 1))
      );
    } else {
      user.setPins([...user.user.pins, website]);
    }
  };

  const sortWebsiteList = () => {
    const pins = [];
    const unpins = [];

    websites.forEach((site) => {
      if (pinnedWebsite[site._id]) {
        pins.push(site);
      } else {
        unpins.push(site);
      }
    });

    setWebsiteList([...pins, ...unpins]);
  };

  useEffect(() => {
    sortWebsiteList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedWebsite]);

  useEffect(() => {
    const pinned = {};

    user.user.pins.forEach((pin) => {
      pinned[pin._id] = true;
    });

    setPinnedWebsite(pinned);
  }, [user, websites]);

  return (
    <WebsiteContainer visible={visible}>
      <Title>Feeds</Title>
      <WebsiteListContainer>
        <WebsiteItem
          selected={selected === PINNED_WEBSITE}
          key="favorites"
          onClick={handleWebsiteSelection(PINNED_WEBSITE)}
        >
          <WebsiteIcon src={CONFIG.ENDPOINTS.websiteIcon('pins')} />
          <WebsiteText>Favorites</WebsiteText>
        </WebsiteItem>

        <WebsiteItem
          selected={selected === ALL_WEBSITE}
          key="all"
          onClick={handleWebsiteSelection(ALL_WEBSITE)}
        >
          <WebsiteIcon src={CONFIG.ENDPOINTS.websiteIcon('all')} />
          <WebsiteText>Daily Feeds</WebsiteText>
        </WebsiteItem>

        {websiteList.length !== 0 &&
          websiteList.map((website) => (
            <WebsiteItem
              selected={website._id === selected}
              key={website._id}
              onClick={handleWebsiteSelection(website._id)}
            >
              <WebsiteIcon src={CONFIG.ENDPOINTS.websiteIcon(website._id)} />
              <WebsiteText>{website.name}</WebsiteText>
              {user.user.isLoggedIn && (
                <WebsiteAction onClick={handleButtonPin(website)}>
                  {pinnedWebsite[website._id] ? <TiPin /> : <TiPinOutline />}
                </WebsiteAction>
              )}
            </WebsiteItem>
          ))}
      </WebsiteListContainer>
    </WebsiteContainer>
  );
};

export default WebsiteList;
