import React, {forwardRef} from 'react';

import type {TabsProps} from '../../typings/nimbus';
import {decorate, getTabProps} from '../utils/plugins';

import DropdownButton from './new-tab';
import Tab_ from './tab';

const Tab = decorate(Tab_, 'Tab');
const isMac = /Mac/.test(navigator.userAgent);

const Tabs = forwardRef<HTMLElement, TabsProps>((props, ref) => {
  const {tabs = [], borderColor, onChange, onClose, fullScreen} = props;

  const hide = !isMac && tabs.length === 1;

  return (
    <nav className={`tabs_nav ${hide ? 'tabs_hiddenNav' : ''}`} ref={ref}>
      {props.customChildrenBefore}
      {tabs.length === 1 && isMac ? <div className="tabs_title">{tabs[0].title}</div> : null}
      {tabs.length > 1 ? (
        <>
          <ul key="list" className={`tabs_list ${fullScreen && isMac ? 'tabs_fullScreen' : ''}`}>
            {tabs.map((tab, i) => {
              const {uid, title, isActive, hasActivity} = tab;
              const tabProps = getTabProps(tab, props, {
                text: title === '' ? 'Shell' : title,
                isFirst: i === 0,
                isLast: tabs.length - 1 === i,
                borderColor,
                isActive,
                hasActivity,
                onSelect: onChange.bind(null, uid),
                onClose: onClose.bind(null, uid)
              });
              return <Tab key={`tab-${uid}`} {...tabProps} />;
            })}
          </ul>
          {isMac && (
            <div
              key="shim"
              style={{borderColor}}
              className={`tabs_borderShim ${fullScreen ? 'tabs_borderShimUndo' : ''}`}
            />
          )}
        </>
      ) : null}
      <DropdownButton {...props} tabsVisible={tabs.length > 1} />
      {props.customChildren}

      <style jsx>{`
        .tabs_nav {
          font-size: 12px;
          height: ${isMac ? '28px' : '34px'};
          line-height: ${isMac ? '28px' : '34px'};
          vertical-align: middle;
          color: ${isMac ? '#86868b' : '#9b9b9b'};
          cursor: default;
          position: relative;
          -webkit-user-select: none;
          -webkit-app-region: ${isMac ? 'drag' : ''};
          top: ${isMac ? '0px' : '34px'};
          display: flex;
          flex-flow: row;
          background: ${isMac ? 'linear-gradient(to bottom, #f6f6f6 0%, #e8e8e8 100%)' : 'transparent'};
          border-bottom: ${isMac ? '1px solid #d1d1d1' : 'none'};
          box-shadow: ${isMac ? '0 1px 0 rgba(255,255,255,0.5) inset' : 'none'};
        }

        .tabs_hiddenNav {
          display: none;
        }

        .tabs_title {
          text-align: center;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          padding-left: 76px;
          padding-right: 76px;
          flex-grow: 1;
        }

        .tabs_list {
          max-height: ${isMac ? '28px' : '34px'};
          display: flex;
          flex-flow: row;
          margin-left: ${isMac ? '76px' : '0'};
          flex-grow: 1;
          align-items: ${isMac ? 'flex-end' : 'center'};
          padding-bottom: ${isMac ? '4px' : '0'};
        }

        .tabs_fullScreen {
          margin-left: -1px;
        }

        .tabs_borderShim {
          position: absolute;
          width: 76px;
          bottom: 0;
          border-color: #ccc;
          border-bottom-style: solid;
          border-bottom-width: 1px;
        }

        .tabs_borderShimUndo {
          border-bottom-width: 0px;
        }
      `}</style>
    </nav>
  );
});

Tabs.displayName = 'Tabs';

export default Tabs;
