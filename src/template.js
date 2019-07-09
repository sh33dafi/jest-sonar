module.exports = `<testExecutions version="1">
{{each(options.testResults)}}
    <file path="{{@this.path}}">
    {{each(@this.testCases)}}
    {{if(@this.failures.length === 0)}}
<testCase name="{{@this.name}}" duration="{{@this.duration}}" />
    {{#else}}
    <testCase name="{{@this.name}}" duration="{{@this.duration}}">
        {{each(@this.failures)}}
        <failure message="Error">
        <![CDATA[{{@this}}]]>
        </failure>
        {{/each}}
    </testCase>
    {{/if}}
    {{/each}}
    </file>
{{/each}}
</testExecutions>`;
