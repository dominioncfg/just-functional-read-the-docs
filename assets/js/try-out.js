const backendRootUrl = 'https://justfunctionalevaluator.azurewebsites.net/api/v2/math';
const EvaluatorComponent = {
    data() {
        return {
            expression: '',
            variables: [],
            result: 0
        }
    },
    methods: {
        addVariable() {
            this.variables.push({ name: "", value: null });
        },
        deleteVariable(counter) {
            this.variables.splice(counter, 1);
        },
        async evaluate() {
            const fx = this.expression;
            const backendUrl = new URL(`${backendRootUrl}/evaluate`);

            backendUrl.searchParams.append("expression", fx);
            this.variables.forEach(variable => {
                backendUrl.searchParams.append(`Variables[${variable.name}]`, variable.value);
            });
            const requestUrl = backendUrl.href

            try {
                const response = await axios.get(requestUrl);
                this.result = response.data.result;
            } catch (error) {
                console.error(error);
                this.result = null;
            }
        }
    },
    template: `
    <div>
        <div class="form-group">
            <label for='expression'>Expression</label>
            <input v-model="expression" class="form-group__input" type="text" name='expression'/>
        </div>

        <div class="form-group-section-header">
            <h3>Variables</h3>
            <a class='main-button tool-button-small' @click="addVariable">Add</a>
        </div>
        <div class="form-group" v-for="(variable, counter) in variables" v-bind:key="counter">
            <label class="right-inline" :for="'name' + counter">{{counter+1}}. Name</label>
            <input v-model.lazy="variable.name" type="text" :name="'name' + counter" class="form-group__input" required>
                
            <label class="right-inline" :for="'value' + counter">Value</label>
            <input v-model.lazy="variable.value" type="text" :name="'value' + counter" class="form-group__input"  required>

            <span class='main-button form-group__remove-action' @click="deleteVariable(counter)">x</span>
        </div>

        <div class='form-action'>
            <a class='main-button main-button--small' @click="evaluate">Calculate</a>
        </div>
        <div class="form-result">
            <label>Result:</label>
            <label>{{result}}</label>
        </div>
    </div>`
};

const ValidationComponent = {
    data() {
        return {
            expression: '',
            variables: [],
            isValid: null
        }
    },
    methods: {
        addVariable() {
            this.variables.push({ name: "" });
        },
        deleteVariable(counter) {
            this.variables.splice(counter, 1);
        },
        async validate() {
            const fx = this.expression;
            const backendUrl = new URL(`${backendRootUrl}/validate`);

            backendUrl.searchParams.append("expression", fx);
            this.variables.forEach(variable => {
                backendUrl.searchParams.append(`Variables`, variable.name);
            });
            const requestUrl = backendUrl.href

            try {
                const response = await axios.get(requestUrl);
                this.isValid = response.data.success;
            } catch (error) {
                console.error(error);
            }
        }
    },
    template: `
        <div class="form-group">
            <label class="form-group__label">Expression</label>
            <input class="form-group__field" type="text" v-model="expression">
        </div>

        <div>
            <h3>Variables</h3>
            <div><button @click="addVariable">Add</button></div>
        </div>
        <div>
            <div v-for="(variable, counter) in variables" v-bind:key="counter">
                <span @click="deleteVariable(counter)">x</span>
                <label for="name">{{counter+1}}. Name:</label>
                <input type="name" v-model.lazy="variable.name" required>               
            </div>
        </div>
        <div>
            <a class='main-button' @click="validate">Validate</a>
        </div>
        <div>
            <label v-if='isValid===true' >The Expression is valid.</label>
            <label v-if='isValid===false' >The Expression is not valid.</label>            
        </div>`
};

const rootComponent = {
    data() {
        return {
            showEvaluator: true,
            showValidator: false,
        }
    },
    methods: {
        showEvaluatorOnly() {
            this.showEvaluator = true;
            this.showValidator = false;
        },
        showValidatorOnly() {
            this.showEvaluator = false;
            this.showValidator = true;
        }
    },
    template: `
        <div>
            <div class='application-header'>
                <a class='main-button' @click="showEvaluatorOnly">Evaluation</a>
                <a class='main-button' @click="showValidatorOnly">Validation</a>
            </div>
            <div class='application-container'>
                <div class="component-container" v-if="showEvaluator">
                    <evaluator />
                </div>
                <div class="component-container" v-if="showValidator">
                    <validation />
                </div>
            </div>
        </div>`
};


const { createApp } = Vue;
const app = createApp(rootComponent);
app
    .component('evaluator', EvaluatorComponent)
    .component('validation', ValidationComponent);
app.mount('#app')