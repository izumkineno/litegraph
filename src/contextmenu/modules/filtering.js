export function setupContextMenuFiltering(contextMenu, doc, root, LiteGraph) {
    if (!doc) {
        LiteGraph.warn?.("NO root document to add context menu and event", doc, contextMenu.options);
        return;
    }

    // TEXT FILTER by KEYPRESS
    if (root.f_textfilter) {
        doc.removeEventListener("keydown", root.f_textfilter, false);
        doc.removeEventListener("keydown", root.f_textfilter, true);
        root.f_textfilter = false;
    }

    root.f_textfilter = function(e) {
        if (contextMenu.current_submenu) {
            // removing listeners is buggy, this prevent parent menus to process the key event
            LiteGraph.debug?.("Prevent filtering on ParentMenu", contextMenu);
            return;
        }
        if (!contextMenu.allOptions) {
            contextMenu.allOptions = contextMenu.menu_elements; // combo_options;
            contextMenu.selectedOption = false;
        }
        if (!contextMenu.currentOptions) {
            contextMenu.currentOptions = contextMenu.allOptions; // initialize filtered to all
        }
        if (!contextMenu.filteringText) {
            contextMenu.filteringText = "";
        }
        if (e.key) {
            let kdone = false;
            switch (e.key) {
                case "Backspace":
                    if (contextMenu.filteringText.length) {
                        contextMenu.filteringText = contextMenu.filteringText.substring(0, contextMenu.filteringText.length - 1);
                        kdone = true;
                    }
                    break;
                case "Escape":
                    // should close ContextMenu
                    if (root.f_textfilter) {
                        doc.removeEventListener("keydown", root.f_textfilter, false);
                        doc.removeEventListener("keydown", root.f_textfilter, true);
                        root.f_textfilter = false;
                    }
                    contextMenu.close();
                    break;
                case "ArrowDown":
                    do {
                        contextMenu.selectedOption = contextMenu.selectedOption !== false
                            ? Math.min(Math.max(contextMenu.selectedOption + 1, 0), contextMenu.allOptions.length - 1)
                            : 0;
                    } while (
                        contextMenu.allOptions[contextMenu.selectedOption]
                        && contextMenu.allOptions[contextMenu.selectedOption].hidden
                        && contextMenu.selectedOption < contextMenu.allOptions.length - 1
                    );
                    // fix last filtered pos
                    if (contextMenu.allOptions[contextMenu.selectedOption] && contextMenu.allOptions[contextMenu.selectedOption].hidden) {
                        contextMenu.selectedOption = contextMenu.currentOptions[contextMenu.currentOptions.length - 1].menu_index;
                    }
                    kdone = true;
                    break;
                case "ArrowUp":
                    do {
                        contextMenu.selectedOption = contextMenu.selectedOption !== false
                            ? Math.min(Math.max(contextMenu.selectedOption - 1, 0), contextMenu.allOptions.length - 1)
                            : 0;
                    } while (
                        contextMenu.allOptions[contextMenu.selectedOption]
                        && contextMenu.allOptions[contextMenu.selectedOption].hidden
                        && contextMenu.selectedOption > 0
                    );
                    // fix first filtered pos
                    if (contextMenu.allOptions[contextMenu.selectedOption] && contextMenu.allOptions[contextMenu.selectedOption].hidden) {
                        if (contextMenu.currentOptions && contextMenu.currentOptions.length) {
                            contextMenu.selectedOption = contextMenu.currentOptions[0].menu_index;
                        } else {
                            contextMenu.selectedOption = false;
                        }
                    }
                    kdone = true;
                    break;
                case "ArrowLeft":
                    break;
                case "ArrowRight": // right do same as enter
                case "Enter":
                    if (contextMenu.selectedOption !== false) {
                        if (contextMenu.allOptions[contextMenu.selectedOption]) {
                            LiteGraph.debug?.("ContextElement simCLICK", contextMenu.allOptions[contextMenu.selectedOption]);
                            // checking because of bad event removal :: FIX
                            if (contextMenu.allOptions[contextMenu.selectedOption].do_click) {
                                contextMenu.allOptions[contextMenu.selectedOption].do_click(contextMenu.options.event, ignore_parent_menu);
                            }
                        } else {
                            LiteGraph.debug?.("ContextElement selection wrong", contextMenu.selectedOption);
                            // selection fix when filtering
                            contextMenu.selectedOption = contextMenu.selectedOption !== false
                                ? Math.min(Math.max(contextMenu.selectedOption, 0), contextMenu.allOptions.length - 1)
                                : 0;
                        }
                    } else if (contextMenu.filteringText.length) {
                        for (const iO in contextMenu.allOptions) {
                            if (
                                contextMenu.allOptions[iO].style.display !== "none" // filtering for visible
                                && !(contextMenu.allOptions[iO].classList + "").includes("separator")
                                // && contextMenu.allOptions[iO].textContent !== "Add Node"
                                && contextMenu.allOptions[iO].textContent !== "Search"
                            ) {
                                LiteGraph.debug?.("ContextElement simCLICK", contextMenu.allOptions[iO]);
                                // try cleaning parent listeners
                                if (root.f_textfilter) {
                                    if (doc) {
                                        doc.removeEventListener("keydown", root.f_textfilter, false);
                                        doc.removeEventListener("keydown", root.f_textfilter, true);
                                        LiteGraph.debug?.("Cleaned ParentContextMenu listener", doc, contextMenu);
                                    }
                                }
                                const ignore_parent_menu = false; // ?
                                contextMenu.allOptions[iO].do_click(e, ignore_parent_menu); // .click();
                                break;
                            }
                        }
                    }
                    kdone = true;
                    break;
                default:
                    LiteGraph.debug?.("ContextMenu filter: keyEvent", e.key);
                    break;
            }
            if (!kdone && e.key.length == 1) {
                contextMenu.filteringText += e.key;
                if (contextMenu.parentMenu) {
                    // that.lock = true; // ??
                    // that.parentMenu.close(e, true); // clean parent ?? lock ??
                }
            }
        }

        // process text filtering
        if (contextMenu.filteringText && contextMenu.filteringText !== "") {
            const aFilteredOpts = [];
            contextMenu.currentOptions = []; // reset filtered
            for (const iO in contextMenu.allOptions) {
                const txtCont = contextMenu.allOptions[iO].textContent;
                const doesContainW = txtCont.toLocaleLowerCase().includes(contextMenu.filteringText.toLocaleLowerCase());
                const isStartW = txtCont.toLocaleLowerCase().startsWith(contextMenu.filteringText.toLocaleLowerCase());
                const wSplits = txtCont.split("/");
                const isStartLast = ((wSplits.length > 1) && wSplits[wSplits.length - 1].toLocaleLowerCase().startsWith(contextMenu.filteringText.toLocaleLowerCase()))
                    || (wSplits.length == 1 && isStartW);
                const isExtra = (contextMenu.allOptions[iO].classList + "").includes("separator")
                    // || txtCont === "Add Node"
                    || txtCont === "Search";
                contextMenu.allOptions[iO].menu_index = iO; // original allOptions index
                if (doesContainW && !isExtra) {
                    aFilteredOpts.push(contextMenu.allOptions[iO]);
                    contextMenu.allOptions[iO].style.display = "block";
                    contextMenu.allOptions[iO].hidden = false;
                    contextMenu.currentOptions.push(contextMenu.allOptions[iO]); // push filtered options
                    contextMenu.allOptions[iO].filtered_index = contextMenu.currentOptions.length - 1; // filtered index
                } else {
                    contextMenu.allOptions[iO].hidden = true;
                    contextMenu.allOptions[iO].style.display = "none";
                    contextMenu.allOptions[iO].filtered_index = false;
                }
                if (isStartLast) {
                    contextMenu.allOptions[iO].style.fontWeight = "bold";
                } else if (isStartW) {
                    contextMenu.allOptions[iO].style.fontStyle = "italic";
                }
            }
            // selection clamp fix when filtering
            contextMenu.selectedOption = contextMenu.selectedOption !== false
                ? Math.min(Math.max(contextMenu.selectedOption, 0), contextMenu.allOptions.length - 1)
                : 0;
            // fix first filtered pos
            if (contextMenu.allOptions[contextMenu.selectedOption] && contextMenu.allOptions[contextMenu.selectedOption].hidden && contextMenu.currentOptions.length) {
                contextMenu.selectedOption = contextMenu.currentOptions[0].menu_index;
            }
        } else {
            contextMenu.currentOptions = contextMenu.allOptions; // no filtered options
            for (const iO in contextMenu.allOptions) {
                contextMenu.allOptions[iO].style.display = "block";
                contextMenu.allOptions[iO].style.fontStyle = "inherit";
                contextMenu.allOptions[iO].style.fontWeight = "inherit";
                contextMenu.allOptions[iO].hidden = false;
                contextMenu.allOptions[iO].filtered_index = false;
                contextMenu.allOptions[iO].menu_index = iO;
            }
        }
        // process selection (up down)
        const hasSelected = contextMenu.selectedOption !== false;
        if (hasSelected) {
            LiteGraph.debug?.("ContextMenu selection: ", contextMenu.selectedOption);
            for (const iO in contextMenu.allOptions) {
                const isSelected = contextMenu.selectedOption + "" === iO + "";
                if (isSelected) {
                    contextMenu.allOptions[iO].classList.add("selected");
                } else {
                    contextMenu.allOptions[iO].classList.remove("selected");
                }
            }
        }

        // height reset
        const body_rect = document.body.getBoundingClientRect();
        const root_rect = root.getBoundingClientRect();
        root.style.top = contextMenu.top_original + "px";
    };

    doc.removeEventListener("keydown", root.f_textfilter, true);
    doc.addEventListener("keydown", root.f_textfilter, true);
    contextMenu._filterDoc = doc;
}

