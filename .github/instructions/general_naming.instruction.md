## File Naming Pattern

Pattern: `{category}_{subcategory}_{action}.extension`
Purpose: This naming convention ensures files and folders are grouped together logically. Files and folders are sorted alphabetically by category, then subcategory, then action.

- `iops_read.extension`, `iops_write.extension` (IOPS category groups together)
- `latency_read.extension`, `latency_write.extension`, `latency_cdc.extension` (Latency category groups together)
- `memory_low.extension`, `memory_cdc_source.extension`, `memory_cdc_target.extension` (Memory category groups together)

General Examples

- Security scanning: `security_scan_dependencies.yml`, `security_scan_code.yml`
- Database monitoring: `database_performance_cpu.extension`, `database_performance_memory.extension`