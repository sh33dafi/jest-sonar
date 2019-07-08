module.exports = `
<testExecutions version="1">
    {{#testResults}}
    <file path="{{{path}}}">
        {{#testCases}}
        <testCase name="{{name}}" duration="{{duration}}"/>
        {{/testCases}}
    </file>
    {{/testResults}}
</testExecutions>`;
