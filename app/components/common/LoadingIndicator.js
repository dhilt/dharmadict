import React from 'react'
import {FormattedMessage} from 'react-intl'

function LoadingIndicator () {
  return (
    <div data-test-id="LoadingIndicator">
      <FormattedMessage id="LoadingIndicator.main_text" />
      <div data-test-id="LoadingIndicator.sk-fading-circle" className='sk-fading-circle'>
        <div data-test-id="LoadingIndicator.circle-1" className='sk-circle1 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-2" className='sk-circle2 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-3" className='sk-circle3 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-4" className='sk-circle4 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-5" className='sk-circle5 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-6" className='sk-circle6 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-7" className='sk-circle7 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-8" className='sk-circle8 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-9" className='sk-circle9 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-10" className='sk-circle10 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-11" className='sk-circle11 sk-circle' />
        <div data-test-id="LoadingIndicator.circle-12" className='sk-circle12 sk-circle' />
      </div>
    </div>
  )
}

export default LoadingIndicator
