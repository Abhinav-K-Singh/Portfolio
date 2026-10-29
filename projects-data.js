/* =====================================================================
   PROJECT DATA  —  the only file you edit to add or change projects.
   Every project card, the Project Lab page and each project detail page
   are generated from the entries below.

   To add a project:
     • run   python3 new_project.py "My Project" --category hobby
       (adds a ready-to-fill entry below), or
     • copy the TEMPLATE block, paste it above the "ADD NEW PROJECTS" line
       and fill it in.

   Fields
     id          unique, lowercase, dashes only (used in the page URL)
     title       project name
     category    "work" | "hobby" | "study"
     status      "shipped" | "in-progress" | "archived"
     date        "YYYY-MM" (optional; dated projects sort newest first)
     featured    true = also shown on the home page
     role        your role (optional)
     stack       list of tools used
     tags        short keywords (optional)
     summary     1–2 sentence overview
     flow        pipeline/architecture chips: tone "b" bronze, "s" silver, "g" gold
     metrics     big numbers: [{ value: "35%", label: "faster queries" }]
     sections    detail-page blocks: heading + body text + bullets
     links       [{ label: "GitHub", url: "https://..." }]  (http/https only)

   TEMPLATE
   {
     id: "my-project",
     title: "My Project",
     category: "hobby",
     status: "in-progress",
     date: "2026-10",
     featured: false,
     role: "Solo project",
     stack: ["Python", "SQL"],
     tags: ["learning"],
     summary: "One or two sentences on what it is and why you built it.",
     flow: [{ label: "Source", tone: "b" }, { label: "Transform", tone: "s" }, { label: "Output", tone: "g" }],
     metrics: [],
     sections: [
       { heading: "What I built", body: "Short paragraph.", bullets: ["Point one", "Point two"] }
     ],
     links: []
   },
   ===================================================================== */

window.PROJECTS = [
  {
    id: "dfle-migration",
    title: "DFLE Migration",
    category: "work",
    status: "shipped",
    featured: true,
    role: "Cloud Data Engineer, TCS",
    stack: ["Azure Databricks", "Snowflake", "Azure Data Factory", "Control-M"],
    tags: ["medallion", "performance", "data security", "orchestration"],
    summary: "Production-grade ETL on Azure Databricks and Snowflake that powers enterprise reporting and analytics across 1,000+ files.",
    flow: [
      { label: "1,000+ files", tone: "b" },
      { label: "Bronze", tone: "b" },
      { label: "Silver", tone: "s" },
      { label: "Gold", tone: "g" },
      { label: "Snowflake", tone: "g" }
    ],
    metrics: [
      { value: "10M+", label: "records processed" },
      { value: "1,000+", label: "files orchestrated" },
      { value: "35%", label: "faster queries" },
      { value: "30%", label: "less manual effort" }
    ],
    sections: [
      {
        heading: "What I built",
        body: "Built and maintained production-grade ETL pipelines on Azure Databricks and Snowflake that feed enterprise reporting and analytics.",
        bullets: [
          "Implemented a Medallion Architecture (Bronze, Silver, Gold) in Databricks, improving query performance by 35% and data maintainability.",
          "Optimized Spark SQL transformations and execution strategies, reducing processing time by 35% and improving compute utilization."
        ]
      },
      {
        heading: "Orchestration and reliability",
        bullets: [
          "Orchestrated scheduled workflows with Azure Data Factory and Control-M, automating the processing of 1,000+ files and supporting SLA adherence.",
          "Automated dependency detection and parameter extraction across ETL workflows, cutting manual operational effort by 30%."
        ]
      },
      {
        heading: "Data protection",
        bullets: [
          "Applied data-masking and encryption controls to protect 10M+ sensitive records, strengthening data protection and compliance in production."
        ]
      }
    ],
    links: []
  },
  {
    id: "datalynx-sftp-pipeline",
    title: "DataLynx SFTP-to-ADLS Pipelines",
    category: "work",
    status: "shipped",
    featured: true,
    role: "Cloud Data Engineer, TCS",
    stack: ["Azure Data Factory", "SFTP", "Azure Data Lake Storage"],
    tags: ["reusable pipelines", "parameter-driven", "file transfer"],
    summary: "One reusable, parameter-driven Azure Data Factory pipeline that serves many SFTP servers, replacing server-specific pipelines.",
    flow: [
      { label: "SFTP servers", tone: "b" },
      { label: "Generic pipeline", tone: "s" },
      { label: "ADLS", tone: "s" },
      { label: "Business tables", tone: "g" }
    ],
    metrics: [],
    sections: [
      {
        heading: "The problem",
        body: "Each SFTP server would normally need its own pipeline. That multiplies maintenance work every time a new server or customer is added."
      },
      {
        heading: "What I built",
        bullets: [
          "Designed a reusable, parameter-driven generic pipeline that connects to multiple SFTP servers via configurable connection details, eliminating the need for server-specific pipelines.",
          "Configured a reusable linked service for secure inbound and outbound file transfers between SFTP servers and ADLS.",
          "Developed a parent orchestration pipeline that invokes the generic pipeline, moves files for processing, applies customer-defined filtering rules, and loads results into new business-aligned tables."
        ]
      }
    ],
    links: []
  },
  {
    id: "walgreens-healthcare-data-platform",
    title: "Walgreens Healthcare Data Platform",
    category: "work",
    status: "shipped",
    featured: true,
    role: "Cloud Data Engineer",
    stack: ["Azure Databricks", "Spark SQL", "Snowflake"],
    tags: ["healthcare", "query tuning", "semi-structured data"],
    summary: "Scalable ETL pipelines that bring structured and semi-structured healthcare data into Snowflake for analytics.",
    flow: [
      { label: "Healthcare sources", tone: "b" },
      { label: "Databricks", tone: "s" },
      { label: "Snowflake", tone: "g" },
      { label: "Analytics", tone: "g" }
    ],
    metrics: [],
    sections: [
      {
        heading: "What I built",
        bullets: [
          "Built scalable ETL pipelines to ingest structured and semi-structured healthcare data into Snowflake, supporting analytics across millions of records.",
          "Improved warehouse query performance and data availability through SQL tuning and query optimization."
        ]
      }
    ],
    links: []
  },
  {
    id: "ecommerce-store-data-pipeline",
    title: "E-Commerce Store Data Pipeline",
    category: "work",
    status: "shipped",
    featured: true,
    role: "Cloud Data Engineer",
    stack: ["Azure Databricks", "Azure Data Factory"],
    tags: ["medallion", "automated reporting"],
    summary: "A Medallion Architecture that improved data quality and analytical query performance for store reporting.",
    flow: [
      { label: "Bronze", tone: "b" },
      { label: "Silver", tone: "s" },
      { label: "Gold", tone: "g" },
      { label: "Reports", tone: "g" }
    ],
    metrics: [],
    sections: [
      {
        heading: "What I built",
        bullets: [
          "Designed a Medallion Architecture (Bronze, Silver, Gold) to improve data quality and analytical query performance.",
          "Automated data processing and reporting workflows, improving the consistency and reliability of business reports."
        ]
      }
    ],
    links: []
  }

  /* ADD NEW PROJECTS ABOVE THIS LINE (keep a comma after the previous entry) */
];
