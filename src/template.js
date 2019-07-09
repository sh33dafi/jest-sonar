module.exports = `
<testExecutions version="1">
    {{#testResults}}
    <file path="{{{path}}}">
        {{#testCases}}
        <testCase name="{{name}}" duration="{{duration}}">{{#failures}}<failure message="Error"><![CDATA[{{{.}}}]]></failure>{{/failures}}</testCase>
        {{/testCases}}
    </file>
    {{/testResults}}
</testExecutions>`;
