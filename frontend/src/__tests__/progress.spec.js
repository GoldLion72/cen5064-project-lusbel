import { it, expect, vi, afterEach } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import ProgressView from '../components/ProgressView.vue';
import ProgressChart from '../components/ProgressChart.vue';
import { nextTick } from 'vue';

afterEach(() => {
    vi.clearAllMocks();
});

it('displays progress made message when madeProgress is true', async () => {
    const dummyData = {
        progressMade: true,
        events: [{DATE: '2026-11-8', VALUE: 3}, {DATE: '2026-11-12', VALUE: 5}]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: dummyData})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

    const progressMsg = wrapper.find('#progressMsg');

    expect(progressMsg.classes()).toContain('has-background-primary');
    expect(progressMsg.text()).toBe('Progress made!');
});

it('displays no progress made message when madeProgress is false', async () => {
    const dummyData = {
        progressMade: false,
        events: [{DATE: '2026-11-8', VALUE: 5}, {DATE: '2026-11-12', VALUE: 3}]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: dummyData})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

    const progressMsg = wrapper.find('#progressMsg');

    expect(progressMsg.classes()).toContain('has-background-danger');
    expect(progressMsg.text()).toBe('No progress made.');
});

it('has ProgressChart component upon successful chart.', async () => {
    const dummyData = {
        progressMade: true,
        events: [{DATE: '2026-11-8', VALUE: 3}, {DATE: '2026-11-12', VALUE: 5}]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: dummyData})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

   expect(() => wrapper.getComponent(ProgressChart)).not.toThrow();
});

it('has BarChart component when chart type is Bar', async () => {
    const dummyData = {
        progressMade: false,
        events: [{DATE: '2026-11-8', VALUE: 5}, {DATE: '2026-11-12', VALUE: 3}]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: dummyData})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

    const progressChart = wrapper.getComponent(ProgressChart);

    expect(() => progressChart.getComponent({name: 'BarChart'})).not.toThrow();
});

it('has LineChart component when chart type is Line', async () => {
    const dummyData = {
        progressMade: false,
        events: [{DATE: '2026-11-8', VALUE: 5}, {DATE: '2026-11-12', VALUE: 3}]
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: dummyData})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

    const progressChart = wrapper.getComponent(ProgressChart);

    progressChart.vm.chartType = 'line';
    await nextTick();

    expect(() => progressChart.getComponent({name: 'LineChart'})).not.toThrow();
});

it('displays invalid date error message when bad dates are entered.', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 400,
        ok: false,
        json: async () => ({success: false, message: "Invalid dates.", data: {}})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-15';
    wrapper.vm.endDate = '2026-11-08';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

    const notification = wrapper.getComponent({name: 'NotificationModal'});

    expect(notification.props('title')).toBe('Search failed');
    expect(notification.props('message')).toBe('Invalid dates.');
    expect(notification.text()).toContain('Invalid dates.');
});

it('displays no events found message when no results found.', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
        status: 400,
        ok: false,
        json: async () => ({success: false, message: "No events found.", data: {}})
    })

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-01';
    wrapper.vm.endDate = '2026-11-07';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    await flushPromises();

    const notification = wrapper.getComponent({name: 'NotificationModal'});

    expect(notification.props('title')).toBe('Search failed');
    expect(notification.props('message')).toBe('No events found.');
    expect(notification.text()).toContain('No events found.');
});

it('maintains empty results when clearCriteria is used after searching', async () => {
    const dummyData = {
        progressMade: true,
        events: [{DATE: '2026-11-08', VALUE: 3}, {DATE: '2026-11-12', VALUE: 5}]
    };

    let resolveFetch;
    globalThis.fetch = vi.fn(() => new Promise((resolve) => {
        resolveFetch = resolve;
    }));

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    await wrapper.find('#clearBtn').trigger('click');

    resolveFetch({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: dummyData})
    });
    await flushPromises();

    expect(wrapper.find('#progressMsg').exists()).toBe(false);
    expect(wrapper.findComponent(ProgressChart).exists()).toBe(false);
    expect(wrapper.findComponent({name: 'NotificationModal'}).exists()).toBe(false);
});

it('keeps the latest search results when an older search resolves last', async () => {
    const olderData = {
        progressMade: true,
        events: [{DATE: '2026-11-08', VALUE: 3}, {DATE: '2026-11-12', VALUE: 5}]
    };

    const newerData = {
        progressMade: false,
        events: [{DATE: '2026-11-09', VALUE: 8}, {DATE: '2026-11-13', VALUE: 6}]
    };

    let resolveOlder;
    let resolveNewer;
    globalThis.fetch = vi.fn()
        .mockImplementationOnce(() => new Promise((resolve) => { resolveOlder = resolve; }))
        .mockImplementationOnce(() => new Promise((resolve) => { resolveNewer = resolve; }));

    const wrapper = mount(ProgressView);

    wrapper.vm.startDate = '2026-11-08';
    wrapper.vm.endDate = '2026-11-14';
    wrapper.vm.exercise = 'benchPress';
    wrapper.vm.metric = 'sets';

    await wrapper.find('#searchBtn').trigger('click');

    wrapper.vm.exercise = 'shoulderPress';
    await wrapper.find('#searchBtn').trigger('click');
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);

    resolveNewer({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: newerData})
    });
    await flushPromises();

    resolveOlder({
        status: 200,
        ok: true,
        json: async () => ({success: true, message: "Events found.", data: olderData})
    });
    await flushPromises();

    const progressMsg = wrapper.find('#progressMsg');
    expect(progressMsg.classes()).toContain('has-background-danger');
    expect(progressMsg.text()).toBe('No progress made.');
    expect(wrapper.getComponent(ProgressChart).props('eventData')).toEqual(newerData.events);
    expect(wrapper.findComponent({name: 'NotificationModal'}).exists()).toBe(false);
});

