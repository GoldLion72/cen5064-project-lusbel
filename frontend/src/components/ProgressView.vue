<script setup>
</script>

<template>
    <div class="card">
        <div class="card-header">
            <p class="card-header-title">Criteria</p>
        </div>
        <div class="card-content">
            <div class="columns is-multiline">
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Start</label>
                        <div class="control">
                            <input id="startDate" class="input" type="date" />
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">End</label>
                        <div class="control">
                            <input id="endDate" class="input" type="date" />
                        </div>
                    </div>
                </div>
                <div class="column is-half">
                    <div class="field">
                        <label class="label">Exercise</label>
                        <div class="select is-fullwidth">
                            <select>
                                <option value="">Select</option>
                            </select>
                        </div>
                    </div>
                </div>                
            </div>
        </div>
        <div class="card-footer">
            <a class="card-footer-item">Search</a>
        </div>
    </div>
</template>
