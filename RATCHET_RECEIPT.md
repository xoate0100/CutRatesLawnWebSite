# RATCHET_RECEIPT

**Repository:** `xoate0100/CutRatesLawnWebSite`  
**Generated:** 2026-08-27T06:44:14Z  
**Wave:** fleet-ratchet-full (Wave 0.5)

## Version

| | |
|---|---|
| From | `4.2.0` |
| To | `4.15.0` |
| Hub | `xoate0100/project_initializer@4.15.0` |

## Outcome

**PR opened**



## Flags

- (none)

## Files changed (261)

- `0_phase0_bootstrap/AI_EXECUTION_CONSTRAINTS.md`
- `0_phase0_bootstrap/AI_SANDBOX_RULES.md`
- `0_phase0_bootstrap/META_FRAMEWORK_OVERVIEW.md`
- `0_phase0_bootstrap/META_FRAMEWORK_VERSION.yaml`
- `0_phase0_bootstrap/stack_adapter.yaml`
- `1_global_standards/AI_OPERATING_CONSTITUTION.md`
- `1_global_standards/CI_CD_GUIDE.md`
- `1_global_standards/CODE_STYLE_GUIDE.md`
- `1_global_standards/DATABASE_HYGIENE.md`
- `1_global_standards/DOCS_STANDARDS.md`
- `1_global_standards/GIT_STRATEGY.md`
- `1_global_standards/MVP_SPECIFICATION_GUIDE.md`
- `1_global_standards/SECURITY_BASELINES.md`
- `1_global_standards/SOLID_PRINCIPLES.md`
- `1_global_standards/TEST_STRATEGY_TDD.md`
- `2_framework_templates/.editorconfig`
- `2_framework_templates/COMMIT_MESSAGE_TEMPLATE.md`
- `2_framework_templates/CURSOR_RULES.md`
- `2_framework_templates/ISSUE_TEMPLATE.md`
- `2_framework_templates/PULL_REQUEST_TEMPLATE.md`
- `2_framework_templates/README_TEMPLATE.md`
- `2_framework_templates/v0_project_template.yaml`
- `2_framework_templates/devcontainer/devcontainer.json`
- `2_framework_templates/devcontainer/Dockerfile`
- `2_framework_templates/vscode/settings.json`
- `2_framework_templates/vscode/tasks.json`
- `3_bootstrap_scripts/agentic_coordinate_validate.py`
- `3_bootstrap_scripts/agentic_janitor.py`
- `3_bootstrap_scripts/agentic_session.py`
- `3_bootstrap_scripts/agentic_tools.py`
- `3_bootstrap_scripts/agent_registry_validate.py`
- `3_bootstrap_scripts/ai_behavior_validation.py`
- `3_bootstrap_scripts/ai_reasoning_tuner.py`
- `3_bootstrap_scripts/ai_review.py`
- `3_bootstrap_scripts/append_state_transition.py`
- `3_bootstrap_scripts/apply_proposed_fix.py`
- `3_bootstrap_scripts/architecture_check.py`
- `3_bootstrap_scripts/audit_and_update_docs.py`
- `3_bootstrap_scripts/auto_advance_state.py`
- `3_bootstrap_scripts/check_context_staleness.py`
- `3_bootstrap_scripts/check_governance_install.py`
- `3_bootstrap_scripts/check_large_changeset.py`
- `3_bootstrap_scripts/check_state_transition.py`
- `3_bootstrap_scripts/check_template_updates.py`
- `3_bootstrap_scripts/cleanup-dev.ps1`
- `3_bootstrap_scripts/cleanup-dev.sh`
- `3_bootstrap_scripts/cli.py`
- `3_bootstrap_scripts/commit_validator.py`
- `3_bootstrap_scripts/commit_validator.sh`
- `3_bootstrap_scripts/complexity_check.py`
- `3_bootstrap_scripts/crosswalk.py`
- `3_bootstrap_scripts/decision_registry_validate.py`
- `3_bootstrap_scripts/detect_environment.py`
- `3_bootstrap_scripts/docs_archive.py`
- `3_bootstrap_scripts/docs_sync.py`
- `3_bootstrap_scripts/drift_analyzer.py`
- `3_bootstrap_scripts/drift_vectors_validate.py`
- `3_bootstrap_scripts/drift_vector_check.py`
- `3_bootstrap_scripts/enforce_format.py`
- `3_bootstrap_scripts/enforce_format.sh`
- `3_bootstrap_scripts/factory_run.py`
- `3_bootstrap_scripts/feedback_collector.py`
- `3_bootstrap_scripts/feedback_logger.py`
- `3_bootstrap_scripts/fleet_ratchet.py`
- `3_bootstrap_scripts/fleet_upgrade.py`
- `3_bootstrap_scripts/gates_check.py`
- `3_bootstrap_scripts/gate_enforcement.py`
- `3_bootstrap_scripts/generate_ai_context.py`
- `3_bootstrap_scripts/generate_hook_config.py`
- `3_bootstrap_scripts/governance_drift_validate.py`
- `3_bootstrap_scripts/guardrail_enforcement.py`
- `3_bootstrap_scripts/init_project.py`
- `3_bootstrap_scripts/init_versioning.py`
- `3_bootstrap_scripts/init_wizard.py`
- `3_bootstrap_scripts/install_hooks.py`
- `3_bootstrap_scripts/knowledge_index_build.py`
- `3_bootstrap_scripts/knowledge_query.py`
- `3_bootstrap_scripts/knowledge_sources_validate.py`
- `3_bootstrap_scripts/layout_adaptor.py`
- `3_bootstrap_scripts/match_issue.py`
... and 181 more

## Protected / skipped (3)

- `0_phase0_bootstrap/MVP_SPECIFICATION.yaml`
- `0_phase0_bootstrap/feature_flags.yml`
- `5_reference_architectures/CHILD_REPOSITORY_REGISTRY.yaml`

## Notes

- Template sync via hub `template_directories`, respecting `protected_files`.
- Product runtime paths were not force-overwritten.
- NA-14 / NA-16 were **not** executed in this wave.


## Remediation (2026-08-27T15:06:04Z)

Fleet remediation applied.

- synced hub file: 3_bootstrap_scripts/architecture_check.py
- synced hub file: 3_bootstrap_scripts/knowledge_sources_validate.py
- synced hub file: 3_bootstrap_scripts/agentic_coordinate_validate.py
- synced hub file: 3_bootstrap_scripts/test_task1_gate.py
- synced hub file: 3_bootstrap_scripts/task_workflow_helper.py
- synced hub file: 5_reference_architectures/KNOWLEDGE_SOURCES.yaml
- AI_SANDBOX_RULES references feature_flags.yml

Classification per docs/factory/FLEET_TRIAGE.md.
