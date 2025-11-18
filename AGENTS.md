<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:

- Invoke: Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:

- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
  </usage>

<available_skills>

<skill>
<name>docusaurus-config</name>
<description>Use when working with docusaurus.config.js/ts files to validate or modify Docusaurus configuration</description>
<location>project</location>
</skill>

<skill>
<name>docusaurus-documentation</name>
<description>Use when looking up information from the latest Docusaurus documentation at https://docusaurus.io/docs</description>
<location>project</location>
</skill>

<skill>
<name>docusaurus-plugin-dev</name>
<description>Helps develop and build Docusaurus plugins using this starter template</description>
<location>project</location>
</skill>

<skill>
<name>docusaurus-plugins</name>
<description>Use when creating Docusaurus plugins (remark, rehype, theme, content, lifecycle) to extend markdown, modify HTML, or add custom functionality</description>
<location>project</location>
</skill>

<skill>
<name>docusaurus-themes</name>
<description>Use when swizzling Docusaurus theme components and editing theme elements</description>
<location>project</location>
</skill>

</available_skills>

<!-- SKILLS_TABLE_END -->

</skills_system>
