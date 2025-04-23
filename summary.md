Events

Embla Carousel exposes events that you can listen to in order to react to changes in the carousel.
Usage

You need an initialized carousel in order to make use of events. Events will only be fired during the lifecycle of a carousel and added event listeners will persist even when you hard reset the carousel with the reInit method.
Adding event listeners

After initializing a carousel, we're going to subscribe to the slidesInView event in the following example:

import { useCallback, useEffect } from 'react'import useEmblaCarousel from 'embla-carousel-react'
export function EmblaCarousel() {  const [emblaRef, emblaApi] = useEmblaCarousel()
  const logSlidesInView = useCallback((emblaApi) => {    console.log(emblaApi.slidesInView())  }, [])
  useEffect(() => {    if (emblaApi) emblaApi.on('slidesInView', logSlidesInView)  }, [emblaApi, logSlidesInView])
  // ...}

Removing event listeners

In order to remove an event listener, you'll have to call the off method and make sure to pass the same callback reference you passed to the on method:

import { useCallback, useEffect } from 'react'import useEmblaCarousel from 'embla-carousel-react'
export function EmblaCarousel() {  const [emblaRef, emblaApi] = useEmblaCarousel()
  const logSlidesInViewOnce = useCallback((emblaApi) => {    console.log(emblaApi.slidesInView())    emblaApi.off('slidesInView', logSlidesInViewOnce)  }, [])
  useEffect(() => {    if (emblaApi) emblaApi.on('slidesInView', logSlidesInViewOnce)  }, [emblaApi, logSlidesInViewOnce])
  // ...}

TypeScript

The EmblaEventType is obtained directly from the core package embla-carousel and used like so:

import React, { useCallback } from 'react'import { EmblaCarouselType, EmblaEventType } from 'embla-carousel'import useEmblaCarousel from 'embla-carousel-react'
export function EmblaCarousel() {  const [emblaRef, emblaApi] = useEmblaCarousel()
  const logEmblaEvent = useCallback(    (emblaApi: EmblaCarouselType, eventName: EmblaEventType) => {      console.log(`Embla just triggered ${eventName}!`)    },    []  )
  useEffect(() => {    if (emblaApi) emblaApi.on('slidesInView', logEmblaEvent)  }, [emblaApi, logEmblaEvent])
  // ...}

If you're using pnpm, you need to install embla-carousel as a devDependency when importing types from it like demonstrated above.

This is because even though embla-carousel-react has embla-carousel as a dependency, pnpm makes nested dependencies inaccessible by design.
Reference

Below follows an exhaustive list of all Embla Carousel events together with information about how they work.
init

Once: yes

Runs when the carousel mounts for the first time. This only fires once which means that it won't fire when the carousel is re-initialized using the reInit method.
reInit

Once: no

Runs when the reInit method is called. When the window is resized, Embla Carousel automatically calls the reInit method which will also fire this event.
destroy

Once: yes

Runs when the carousel has been destroyed using the destroy method. This only fires once and will be the last event the carousel fires.
select

Once: no

Runs when the selected scroll snap changes. The select event is triggered by drag interactions or the scrollNext, scrollPrev or scrollTo methods.
scroll

Once: no

Runs when the carousel is scrolling. It might be a good idea to throttle this if you're doing expensive stuff in your callback function.
settle

Once: no

Runs when the carousel has settled after scroll has been triggered. Please note that this can take longer than you think when dragFree is enabled or when using slow transitions.
resize

Once: no

Runs when the carousel container or the slide sizes change. It's using ResizeObserver under the hood.
slidesInView

Once: no

Runs when any slide has entered or exited the viewport. This event is intended to be used together with the slidesInView and/or slidesNotInView methods.
slidesChanged

Once: no

Runs when slides are added to, or removed from the carousel container. It's using MutationObserver under the hood.
slideFocus

Once: no

Runs when a slide receives focus. For example, when a focusable element like a button, link or input receives focus inside a slide.
pointerDown

Once: no

Runs when the user has a pointer down on the carousel. It's triggered by a touchstart or a mousedown event.
pointerUp

Once: no

Runs when the user has released the pointer from the carousel. It's triggered by a touchend or a mouseup event.
------
##Methods

Methods

Embla Carousel exposes a set of useful methods which makes it very extensible.
Usage

You need an initialized carousel in order to make use of methods. They can be accessed during the lifecycle of a carousel and won't do anything after a carousel instance has been destroyed with the destroy method.
Calling methods

In the following example, the slideNodes method is called and logged to the console as soon as the carousel has been initialized:

import { useEffect } from 'react'import useEmblaCarousel from 'embla-carousel-react'
export function EmblaCarousel() {  const [emblaRef, emblaApi] = useEmblaCarousel()
  useEffect(() => {    if (emblaApi) console.log(emblaApi.slideNodes())  }, [emblaApi])
  // ...}

TypeScript

The EmblaCarouselType is obtained directly from the core package embla-carousel and used like so:

import React, { useCallback } from 'react'import { EmblaCarouselType } from 'embla-carousel'import useEmblaCarousel from 'embla-carousel-react'
export function EmblaCarousel() {  const [emblaRef, emblaApi] = useEmblaCarousel()
  const logSlidesInView = useCallback((emblaApi: EmblaCarouselType) => {    console.log(emblaApi.slidesInView())  }, [])
  useEffect(() => {    if (emblaApi) emblaApi.on('slidesInView', logSlidesInView)  }, [emblaApi, logSlidesInView])
  // ...}

If you're using pnpm, you need to install embla-carousel as a devDependency when importing types from it like demonstrated above.

This is because even though embla-carousel-react has embla-carousel as a dependency, pnpm makes nested dependencies inaccessible by design.
Reference

Below follows an exhaustive list of all Embla Carousel methods with their respective parameters and return values.
rootNode

Parameters: none
Returns: HTMLElement

Get the root node that holds the scroll container with slides inside. This method can be useful when you need to manipulate the root element dynamically or similar.
containerNode

Parameters: none
Returns: HTMLElement

Get the container node that holds the slides. This method can be useful when you need to manipulate the container element dynamically or similar.
slideNodes

Parameters: none
Returns: HTMLElement[]

Get all the slide nodes inside the container. This method can be useful when you need to manipulate the slide elements dynamically or similar.
scrollNext

Parameters: jump?: boolean
Returns: void

Scroll to the next snap point if possible. When loop is disabled and the carousel has reached the last snap point, this method won't do anything. Set the jump parameter to true when you want to go to the next slide instantly.
scrollPrev

Parameters: jump?: boolean
Returns: void

Scroll to the previous snap point if possible. When loop is disabled and the carousel has reached the first snap point, this method won't do anything. Set the jump parameter to true when you want to go to the previous slide instantly.
scrollTo

Parameters: index: number, jump?: boolean
Returns: void

Scroll to a snap point by its unique index. If loop is enabled, Embla Carousel will choose the closest way to the target snap point. Set the jump parameter to true when you want to go to the desired slide instantly.
canScrollNext

Parameters: none
Returns: boolean

Check the possiblity to scroll to a next snap point. If loop is enabled and the container holds any slides, this will always return true.
canScrollPrev

Parameters: none
Returns: boolean

Check the possiblity to scroll to a previous snap point. If loop is enabled and the container holds any slides, this will always return true.
selectedScrollSnap

Parameters: none
Returns: number

Get the index of the selected snap point.
previousScrollSnap

Parameters: none
Returns: number

Get the index of the previously selected snap point.
scrollSnapList

Parameters: none
Returns: number[]

Get an array containing all the snap point positions. Each position represents how far the carousel needs to progress in order to reach this position.
scrollProgress

Parameters: none
Returns: number

Check how far the carousel has scrolled of its scrollable length from 0 - 1. For example, 0.5 equals 50%. For example, this can be useful when creating a scroll progress bar.
slidesInView

Parameters: none
Returns: number[]

Get slide indexes visible in the carousel viewport. Honors the inViewThreshold option.
slidesNotInView

Parameters: none
Returns: number[]

Get slide indexes not visible in the carousel viewport. Honors the inViewThreshold option.
internalEngine

Parameters: none
Returns: EmblaEngineType

Exposes almost all internal functionality used by Embla. Useful when creating plugins or similar.

Note: Please refrain from creating bug reports related to this method. If you're using this and running into problems, it's a 99.8% chance that you don't understand how this works. Use at your own risk.
reInit

Parameters: options?: EmblaOptionsType, plugins?: EmblaPluginType[]
Returns: void

Hard reset the carousel after it has been initialized. This method allows for changing options and plugins after initializing a carousel.

Note: Passed options will be merged with current options, but passed plugins will replace current plugins.
plugins

Parameters: none
Returns: EmblaPluginsType

Returns an object with key value pairs where the keys are the plugin names, and the plugin API:s are the values.
destroy

Parameters: none
Returns: void

Destroy the carousel instance permanently. This is a one way operation and is intended to be used as a cleanup measure when the carousel instance isn't needed anymore.
on

Parameters: event: EmblaEventType, callback: (emblaApi: EmblaCarouselType, eventName: EmblaEventType) => void
Returns: void

Subscribe to an Embla specific event with a callback. Added event listeners will persist even if reInit is called, either until the carousel is destroyed or the event is removed with the off method.
off

Parameters: event: EmblaEventType, callback: (emblaApi: EmblaCarouselType, eventName: EmblaEventType) => void
Returns: void

Unsubscribe from an Embla specific event. Make sure to pass the same callback reference when the callback was added with the on method.
emit

Parameters: event: EmblaEventType
Returns: void

Emits an embla event. This doesn't trigger any internal Embla functionality.