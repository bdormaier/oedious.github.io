var TableOfContents = function() {
    this.toc_ = [];
    this.tocFiltered_ = [];
    this.filters = [];
}

TableOfContents.prototype.load = function(callback) {
    var loader = new JsonLoader();
    var self = this;
    loader.load("filters.json", function(json) {
        self.filters = json;
    });
    loader.load("maps/table_of_contents.json", function(json) {
        self.toc_ = json.maps;
        self.applyFilters();
        self.draw();
        callback();
    });
}

TableOfContents.prototype.applyFilters = function() {
    var filterByAge = document.getElementById("selectAge").value;
    var filterByType = document.getElementById("selectType").value;
    var filterBySize = document.getElementById("selectSize").value;
    var filterByName = document.getElementById("name_search").value.toLowerCase();
    var filterBlocking = !document.getElementById("naBlocking").checked;
    var filterBlockingHas = document.getElementById("yesBlocking").checked;
    var filterHindering = !document.getElementById("naHindering").checked;
    var filterHinderingHas = document.getElementById("yesHindering").checked;
    var filterWater = !document.getElementById("naWater").checked;
    var filterWaterHas = document.getElementById("yesWater").checked;
    var filterElevated = !document.getElementById("naElevated").checked;
    var filterElevatedHas = document.getElementById("yesElevated").checked;
    var filterWalls = !document.getElementById("naWalls").checked;
    var filterWallsHas = document.getElementById("yesWalls").checked;
    var filterLocationBonus = !document.getElementById("naLocationBonus").checked;
    var filterLocationBonusHas = document.getElementById("yesLocationBonus").checked;
    this.tocFiltered_ = [];
    for (var i = 0; i < this.toc_.length; ++i) {
        var map = this.toc_[i];
        if (filterByAge != "all" && !(map.age && map.age[filterByAge])) {
            continue;
        }
        if (filterByType != "all" && !this.filters.types[filterByType].includes(map.id)) {
            continue
        }
        if (filterBySize != "all" && !this.filters.sizes[filterBySize].includes(map.id)) {
            continue;
        }
        if (filterByName != "" && !(map.name.toLowerCase().includes(filterByName))) {
            continue;
        }
        if (filterBlocking && this.filters.terrain['blocking'].includes(map.id) != filterBlockingHas) {
            continue;
        }
        if (filterHindering && this.filters.terrain['hindering'].includes(map.id) != filterHinderingHas) {
            continue;
        }
        if (filterWater && this.filters.terrain['water'].includes(map.id) != filterWaterHas) {
            continue;
        }
        if (filterElevated && this.filters.terrain['elevation'].includes(map.id) != filterElevatedHas) {
            continue;
        }
        if (filterWalls && this.filters.terrain['walls'].includes(map.id) != filterWallsHas) {
            continue;
        }
        if (filterLocationBonus && this.filters['locationBonus'].includes(map.id) != filterLocationBonusHas) {
            continue;
        }
        this.tocFiltered_.push(map);
    }
}

TableOfContents.prototype.draw = function() {
    var html = "";
    var currentSet = "";
    for (var i = 0; i < this.tocFiltered_.length; ++i) {
        var map = this.tocFiltered_[i];
        if (currentSet != map.set) {
            if (currentSet != "") {
                html += "</ul>"
            }
            html += `<ul><li><h6>${map.set}</h6></li>`;
            currentSet = map.set;
        }
        html += `
            <li class="mapLink">
                <a href='' id='toc${i}' onclick='mgr.setMap(${i}); return false;'>
                    ${map.name}
                </a>
            </li>`;
    }
    html += "</ul>";
    document.getElementById("tableOfContents").innerHTML = html;
}

TableOfContents.prototype.getFilteredEntry = function(index) {
    return this.tocFiltered_[index];
}

TableOfContents.prototype.getFilteredSize = function() {
    return this.tocFiltered_.length;
}

TableOfContents.prototype.getIndexByMapId = function(mapId) {
    if (mapId) {
        for (var i = 0; i < this.tocFiltered_.length; ++i) {
            if (mapId == this.tocFiltered_[i].id) {
                return i;
            }
        }
    }
    return -1;
}
