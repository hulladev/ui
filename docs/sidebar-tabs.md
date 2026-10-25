# Sidebar tabs

`SidebarTabs` and `SidebarTabsList` compose the existing horizontal Tabs primitives for a bounded sidebar. Available in Astro, React, and Solid, they accept the corresponding Tabs props except root orientation. They introduce no state, events, context, or custom props. Standard TabsTrigger and TabsContent retain their semantics, keyboard interaction, disabled states, controlled selection, and focus treatment.

Place SidebarTabsList before SidebarContent so the full-width, equal-width tab buttons remain visible while navigation scrolls. Give the Sidebar a bounded height; SidebarTabs fills the space between its header and footer. SidebarContent owns scrolling; panels remain ordinary TabsContent components.

```astro
<Sidebar class="h-96">
  <SidebarHeader>Project</SidebarHeader>
  <SidebarTabs defaultValue="docs">
    <SidebarTabsList aria-label="Project area">
      <TabsTrigger value="docs">Docs</TabsTrigger>
      <TabsTrigger value="guides">Guides</TabsTrigger>
    </SidebarTabsList>
    <SidebarContent>
      <TabsContent value="docs">Documentation navigation</TabsContent>
      <TabsContent value="guides">Guide navigation</TabsContent>
    </SidebarContent>
  </SidebarTabs>
</Sidebar>
```

Keep the list and scroll area as siblings within the root. For vertical or standalone tabs, use Tabs and TabsList directly. The sidebar catalog preview demonstrates this composition with real generated components; its rendered source is imported from that preview file.
