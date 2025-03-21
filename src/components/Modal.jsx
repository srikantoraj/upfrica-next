import React from 'react';

const Modal = () => {
    return (
        <div>

            


            <div
                data-twe-modal-init
                class="fixed left-0 top-0 z-[1055] hidden h-full w-full overflow-y-auto overflow-x-hidden outline-none"
                id="exampleModalTips"
                tabindex="-1"
                aria-labelledby="exampleModalTipsLabel"
                aria-hidden="true">
                <div
                    data-twe-modal-dialog-ref
                    class="pointer-events-none relative w-auto translate-y-[-50px] opacity-0 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:mt-7 min-[576px]:max-w-[500px]">
                    <div
                        class="pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-4 outline-none dark:bg-surface-dark">
                        <div
                            class="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 p-4 dark:border-white/10">
                            <h5
                                class="text-xl font-medium leading-normal text-surface dark:text-white"
                                id="exampleModalTipsLabel">
                                Modal title
                            </h5>
                            <button
                                type="button"
                                class="box-content rounded-none border-none text-neutral-500 hover:text-neutral-800 hover:no-underline focus:text-neutral-800 focus:opacity-100 focus:shadow-none focus:outline-none dark:text-neutral-400 dark:hover:text-neutral-300 dark:focus:text-neutral-300"
                                data-twe-modal-dismiss
                                aria-label="Close">
                                <span class="[&>svg]:h-6 [&>svg]:w-6">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                        <div
                            class="relative flex-auto p-4 text-center"
                            data-twe-modal-body-ref>
                            <h5 class="mb-2 text-xl font-bold">Popover in a modal</h5>
                            <div class="mb-4 flex items-center justify-center gap-1">
                                This
                                <button
                                    type="button"
                                    class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                    data-twe-toggle="popover"
                                    data-twe-title="Popover title"
                                    data-twe-content="Popover body content is set in this attribute."
                                    data-twe-ripple-init
                                    data-twe-ripple-color="light">
                                    button
                                </button>
                                triggers a popover on click.
                            </div>
                            <hr class="my-4 dark:border-neutral-500" />
                            <h5 class="mb-2 text-xl font-bold">Tooltips in a modal</h5>
                            <p class="mb-4">
                                <a
                                    href="#"
                                    class="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                    data-twe-toggle="tooltip"
                                    title="Tooltip"
                                >This link</a
                                >
                                and
                                <a
                                    href="#"
                                    class="transititext-primary text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500 dark:focus:text-primary-500 dark:active:text-primary-600"
                                    data-twe-toggle="tooltip"
                                    title="Tooltip"
                                >that link</a
                                >
                                have tooltips on hover.
                            </p>
                        </div>
                        <div
                            class="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 p-4 dark:border-white/10">
                            <button
                                type="button"
                                class="inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-200 focus:bg-primary-accent-200 focus:outline-none focus:ring-0 active:bg-primary-accent-200 dark:bg-primary-300 dark:hover:bg-primary-400 dark:focus:bg-primary-400 dark:active:bg-primary-400"
                                data-twe-modal-dismiss
                                data-twe-ripple-init
                                data-twe-ripple-color="light">
                                Close
                            </button>
                            <button
                                type="button"
                                class="ms-1 inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                data-twe-ripple-init
                                data-twe-ripple-color="light">
                                Save changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;